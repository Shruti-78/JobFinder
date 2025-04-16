const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();
app.use(express.static(__dirname)); // Serve HTML from current folder

const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost.pem')),
};

https.createServer(options, app).listen(443, () => {
  console.log('Secure server at https://localhost');
});
