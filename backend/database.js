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
    },
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
      daily_activity TEXT DEFAULT '50',
      weekly_workouts INTEGER DEFAULT 3,
      current_height INTEGER,
      current_age INTEGER,
      onboarding_completed INTEGER DEFAULT 0,
      water_cycle_start TEXT DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating user_profiles table:", err.message);
      } else {
        console.log("User profiles table ready");
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS water_logs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating water_logs table:", err.message);
      } else {
        console.log("Water logs table ready");
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS sleep_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL DEFAULT (DATE('now', 'localtime')),
      in_bed_time TIME NOT NULL DEFAULT (TIME('now', 'localtime')),
      out_of_bed_time TIME NOT NULL DEFAULT (TIME('now', 'localtime')),
      sleep_quality INTEGER,
      duration_hours REAL,
      sleep_score INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating sleep_logs table:", err.message);
      } else {
        console.log("Sleep logs table ready");
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT (DATE('now', 'localtime')),
    weight REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
    (err) => {
      if (err) {
        console.error("Error creating weight_logs table:", err.message);
      } else {
        console.log("Weight logs table ready");
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL DEFAULT (DATE('now', 'localtime')),
      time TIME NOT NULL DEFAULT (TIME('now', 'localtime')),
      activity_type TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      calories_burned INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating workouts table:", err.message);
      } else {
        console.log("Workouts table ready");
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL DEFAULT (DATE('now', 'localtime')),
      meal_type TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL,
      carbs REAL,
      fats REAL,
      grammage REAL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    (err) => {
      if (err) {
        console.error("Error creating meals table:", err.message);
      } else {
        console.log("Meals table ready");
      }
    },
  );

  console.log("Database setup complete.");
});

module.exports = db;
