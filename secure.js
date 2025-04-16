const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Secure login with parameterized query
app.get('/', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (row) res.send(`Welcome ${row.username}`);
    else res.send('Login failed');
  });
});

// Secure comment with escaping
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  }[char]));
}

app.get('/comment', (req, res) => res.render('comment'));
app.post('/comment', (req, res) => {
  const { comment } = req.body;
  res.send(`<h2>Comment Received:</h2> ${escapeHTML(comment)}`);
});

// Load SSL certificate and key from the certs folder
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost.pem')),
};

// Start the HTTPS server on port 4433
https.createServer(sslOptions, app).listen(4433, () => {
  console.log('🔒 HTTPS server running at https://localhost:4433');
});
