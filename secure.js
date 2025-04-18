const fs = require('fs');
const https = require('https');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4433;

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

// GET all open jobs securely
app.get('/jobs', (req, res) => {
  const sql = `SELECT title, company, ctc, location, job_vacancy_status AS vacancy FROM jobs WHERE job_vacancy_status = ?`;
  db.all(sql, ['open'], (err, rows) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
  });
});

// Secure search endpoint (uses parameterized query)
app.get('/search-secure', (req, res) => {
  const queryParam = `%${req.query.q || ''}%`;
  const sql = `SELECT title, company, ctc, location, job_vacancy_status AS vacancy FROM jobs WHERE job_vacancy_status = ? AND title LIKE ?`;

  db.all(sql, ['open', queryParam], (err, rows) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
  });
});

// HTTPS server start
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`🔒 Secure server running at https://localhost:${port}`);
});
