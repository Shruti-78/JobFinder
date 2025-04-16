// verify.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data.db");

db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error("❌ Error querying database:", err.message);
  } else {
    console.log("📋 Users in database:");
    console.table(rows);
  }
  db.close();
});
