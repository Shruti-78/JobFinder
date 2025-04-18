//insecure.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./data.db');

app.use(express.static('public'));

app.get('/jobs', (req, res) => {
    db.all(`SELECT title, company, ctc, location, job_vacancy_status AS vacancy FROM jobs WHERE job_vacancy_status = 'open'`, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
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
