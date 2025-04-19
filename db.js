const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  // Drop existing tables
//   db.run(`DROP TABLE IF EXISTS jobs`);
  db.run(`DROP TABLE IF EXISTS feedback`);

  // Create users table
  // db.run(`
  //   CREATE TABLE users (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     username TEXT UNIQUE NOT NULL,
  //     email TEXT UNIQUE NOT NULL,
  //     password TEXT NOT NULL,
  //     role TEXT CHECK(role IN ('employer', 'jobseeker')) NOT NULL,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  //   )
  // `);

  // Create jobs table with new columns
  // db.run(`
  //   CREATE TABLE jobs (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     title TEXT NOT NULL,
  //     description TEXT NOT NULL,
  //     company TEXT NOT NULL,
  //     location TEXT NOT NULL,
  //     posted_by INTEGER NOT NULL,
  //     posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     ctc TEXT,
  //     company_website TEXT,
  //     job_vacancy_status TEXT CHECK(job_vacancy_status IN ('open', 'closed')) NOT NULL,
  //     FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
  //   )
  // `);

  db.run(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  )
`);


  // Sample users
//   const users = [
//     { username: "employer1", email: "emp1@example.com", password: "123", role: "employer" },
//     { username: "employer2", email: "emp2@example.com", password: "123", role: "employer" },
//     { username: "jobseeker1", email: "seeker1@example.com", password: "123", role: "jobseeker" }
//   ];

//   const userIds = {};

//   const insertUser = db.prepare(`
//     INSERT INTO users (username, email, password, role)
//     VALUES (?, ?, ?, ?)
//   `);

//   users.forEach((user, index) => {
//     insertUser.run([user.username, user.email, user.password, user.role], function (err) {
//       if (err) {
//         console.error(`❌ Error inserting user ${user.username}:`, err.message);
//       } else {
//         userIds[user.username] = this.lastID;

//         // Once all users are inserted, insert jobs
//         if (Object.keys(userIds).length === users.length) {
//           const jobs = [
//             ["Frontend Developer", "React and Tailwind UI", "TechCorp", "Remote", userIds["employer1"], "10-12 LPA", "https://techcorp.com", "open"],
//             ["Backend Developer", "Node.js, Express, SQL", "TechCorp", "Bangalore", userIds["employer1"], "12-15 LPA", "https://techcorp.com", "closed"],
//             ["Product Manager", "Manage roadmap & features", "BuildIt", "Mumbai", userIds["employer1"], "15-18 LPA", "https://buildit.com", "open"],
//             ["UI/UX Designer", "Design mockups and prototypes", "CreativeStudio", "Delhi", userIds["employer2"], "7-10 LPA", "https://creativestudio.com", "closed"],
//             ["Data Analyst", "Work with data pipelines and BI tools", "DataX", "Remote", userIds["employer2"], "8-12 LPA", "https://datax.com", "open"],
//             ["DevOps Engineer", "CI/CD and cloud infra", "CloudWorks", "Hyderabad", userIds["employer2"], "12-14 LPA", "https://cloudworks.com", "open"],
//             ["Mobile Developer", "Flutter or React Native apps", "Appify", "Chennai", userIds["employer1"], "10-13 LPA", "https://appify.com", "open"],
//             ["AI Research Intern", "NLP and ML models", "VisionTech", "Pune", userIds["employer2"], "Internship", "https://visiontech.com", "open"]
//           ];

//           const insertJob = db.prepare(`
//             INSERT INTO jobs (title, description, company, location, posted_by, ctc, company_website, job_vacancy_status)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `);

//           jobs.forEach(job => insertJob.run(job));
//           insertJob.finalize(() => {
//             console.log("✅ Database setup complete with users and job listings.");
//             db.close();
//           });
//         }
//       }
//     });
//   });

//   insertUser.finalize();
});
