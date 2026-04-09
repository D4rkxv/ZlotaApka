const express = require("express");
const router = express.Router();
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const date = req.query.date || new Date().toISOString().split("T")[0];

  db.get(
    "SELECT * FROM daily_workout WHERE user_id = ? AND date = ?",
    [userId, date],
    (err, row) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      if (!row) return res.json({ status: "success", data: null });
      try {
        const workout = JSON.parse(row.workout_json);
        return res.json({
          status: "success",
          data: { workout, date: row.date },
        });
      } catch {
        return res
          .status(500)
          .json({ status: "error", message: "Invalid JSON in DB" });
      }
    },
  );
});

router.post("/", authenticateToken, (req, res) => {
  console.log("POST daily-workout hit, user:", req.user?.id, "body:", req.body);
  const userId = req.user.userId;
  const { workout, date } = req.body;

  if (!workout || !date) {
    return res
      .status(400)
      .json({ status: "error", message: "workout and date required" });
  }

  const workoutJson = JSON.stringify(workout);

  db.run(
    `INSERT INTO daily_workout (user_id, workout_name, workout_json, date)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET workout_json = excluded.workout_json, workout_name = excluded.workout_name`,
    [userId, workout.name || "Workout", workoutJson, date],
    function (err) {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      return res.json({ status: "success", data: { workout, date } });
    },
  );
});

module.exports = router;
