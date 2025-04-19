//insecure.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./data.db');

app.use(express.static('public'));

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

        res.sendFile(__dirname + '/public/job-detail.html');
    });
});

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

app.use(express.json());

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






app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/search-vuln', (req, res) => {
    const queryParam = req.query.q || '';
    const sql = `SELECT title, company, ctc, location, job_vacancy_status as vacancy FROM jobs WHERE job_vacancy_status = 'open' and title LIKE '%${queryParam}%'`;  // 🚨 vulnerable

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("SQL Error:", err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

// query to show vulnerablity in website
//' UNION SELECT username, email, null, password, null FROM users -- 
//<img src="x" onerror="if(!window.shown){alert('This site is vulnerable!');window.shown=1;location.href='https://wikipedia.com'}">

