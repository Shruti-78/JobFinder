const fs = require('fs');
const https = require('https');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4400;

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost.pem')),
};

// Database setup
const db = new sqlite3.Database('./data.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public-secure'));

// Escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[match]));
}

// GET all open jobs securely
app.get('/jobs', (req, res) => {
  db.all(`SELECT id,title, company, ctc, location, job_vacancy_status AS vacancy FROM jobs WHERE job_vacancy_status = 'open'`, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(rows);
  });
});

// Secure search endpoint (uses parameterized query)
app.get('/search-secure', (req, res) => {
  const queryParam = `%${req.query.q || ''}%`;
  const sql = `SELECT id,title, company, ctc, location, job_vacancy_status AS vacancy FROM jobs WHERE job_vacancy_status = ? AND title LIKE ?`;

  db.all(sql, ['open', queryParam], (err, rows) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
  });
});

// Serve job detail HTML with embedded safe data
app.get('/job/:id', (req, res) => {
  const jobId = req.params.id;

  db.get(`SELECT * FROM jobs WHERE id = ?`, [jobId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (!row) {
      return res.status(404).send('Job not found');
    }

    const jobData = {
      id: row.id,
      title: escapeHTML(row.title),
      description: escapeHTML(row.description),
      company: escapeHTML(row.company),
      location: escapeHTML(row.location),
      ctc: escapeHTML(row.ctc),
      posted_at: escapeHTML(row.posted_at),
      company_website: escapeHTML(row.company_website),
    };

    const jobHtml = fs.readFileSync(path.join(__dirname, 'public-secure', 'job-detail.html'), 'utf8');
    const populatedHtml = jobHtml.replace(
      '<div id="jobData"></div>',
      `<script>window.__JOB_DATA__ = ${JSON.stringify(jobData)};</script>`
    );

    res.send(populatedHtml);
  });
});

// API route for fetching raw job data (used by frontend JS or APIs)
app.get('/api/job/:id', (req, res) => {
  const jobId = req.params.id;

  db.get(
    `SELECT id, title, description, company, location, ctc, company_website, posted_at, job_vacancy_status 
     FROM jobs WHERE id = ?`,
    [jobId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json(row);
    }
  );
});

// Feedback routes
app.post('/api/job/:id/feedback', (req, res) => {
  const jobId = req.params.id;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  const query = `INSERT INTO feedback (job_id, comment) VALUES (?, ?)`;
  db.run(query, [jobId, comment], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to insert feedback' });
    }
    res.json({ id: this.lastID, comment });
  });
});

app.get('/api/job/:id/feedback', (req, res) => {
  const jobId = req.params.id;

  db.all(
    `SELECT comment FROM feedback WHERE job_id = ? ORDER BY created_at DESC`,
    [jobId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch feedback' });
      }
      res.json(rows);
    }
  );
});

// HTTPS server start
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`🔒 Secure server running at https://localhost:${port}`);
});
