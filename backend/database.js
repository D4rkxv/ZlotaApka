const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "vitatrack.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.run(`PRAGMA foreign_keys = ON;`);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INTEGER PRIMARY KEY,
      hydration_goal REAL DEFAULT 2.5,
      sleep_goal_hours INTEGER DEFAULT 8,
      sleep_goal_minutes INTEGER DEFAULT 0,
      in_bed_time TEXT DEFAULT '23:00',
      out_of_bed_time TEXT DEFAULT '07:00',
      calories_goal INTEGER DEFAULT 2000,
      current_weight REAL,
      goal_weight REAL,
      gender TEXT,
      daily_activity TEXT DEFAULT 'moderate',
      weekly_workouts INTEGER DEFAULT 3,
      current_height INTEGER,
      current_age INTEGER,
      onboarding_completed INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating user_profiles table:", err.message);
      } else {
        console.log("User profiles table ready");
      }
    }
  );

  console.log("Database setup complete.");
});

module.exports = db;
