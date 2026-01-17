const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { date, limit = 100 } = req.query;

  let query = `SELECT * FROM workouts WHERE user_id = ?`;
  let params = [userId];

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }

  query += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: "error",
        message: "Error fetching workouts",
      });
    }

    res.json({
      status: "success",
      data: rows || [],
    });
  });
});

router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { date, time, activity_type, duration_minutes, calories_burned, notes } = req.body;

  if (!activity_type || !duration_minutes) {
    return res.status(400).json({
      status: "error",
      message: "Activity type and duration are required",
    });
  }

  const workoutDate = date || new Date().toISOString().split("T")[0];
  const workoutTime = time || new Date().toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  db.run(
    `INSERT INTO workouts (user_id, date, time, activity_type, duration_minutes, calories_burned, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, workoutDate, workoutTime, activity_type, duration_minutes, calories_burned || null, notes || null],
    function (err) {
      if (err) {
        console.error("Error adding workout:", err);
        return res.status(500).json({
          status: "error",
          message: "Error adding workout",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          id: this.lastID,
          user_id: userId,
          date: workoutDate,
          time: workoutTime,
          activity_type,
          duration_minutes,
          calories_burned,
          notes,
        },
      });
    }
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  db.run(
    `DELETE FROM workouts WHERE id = ? AND user_id = ?`,
    [id, userId],
    function (err) {
      if (err) {
        console.error("Error deleting workout:", err);
        return res.status(500).json({
          status: "error",
          message: "Error deleting workout",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          status: "error",
          message: "Workout not found",
        });
      }

      res.json({
        status: "success",
        message: "Workout deleted",
      });
    }
  );
});

router.get("/stats", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const today = new Date().toISOString().split("T")[0];

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  db.all(
    `SELECT date, SUM(duration_minutes) as total_minutes, SUM(calories_burned) as total_calories, COUNT(*) as count
     FROM workouts 
     WHERE user_id = ? AND date IN (${last7Days.map(() => "?").join(",")})
     GROUP BY date`,
    [userId, ...last7Days],
    (err, weeklyData) => {
      if (err) {
        console.error("Error fetching workout stats:", err);
        return res.status(500).json({
          status: "error",
          message: "Error fetching workout stats",
        });
      }

      const statsByDate = {};
      weeklyData.forEach((row) => {
        statsByDate[row.date] = {
          minutes: row.total_minutes || 0,
          calories: row.total_calories || 0,
          count: row.count || 0,
        };
      });

      const weeklyArray = last7Days.map((date) => ({
        date,
        minutes: statsByDate[date]?.minutes || 0,
        calories: statsByDate[date]?.calories || 0,
        count: statsByDate[date]?.count || 0,
      }));

      db.all(
        `SELECT * FROM workouts WHERE user_id = ? AND date = ? ORDER BY time DESC`,
        [userId, today],
        (err, todayWorkouts) => {
          if (err) {
            console.error("Error fetching today's workouts:", err);
            return res.status(500).json({
              status: "error",
              message: "Error fetching today's workouts",
            });
          }

          res.json({
            status: "success",
            data: {
              today: todayWorkouts || [],
              weekly: weeklyArray,
              weeklyTotal: weeklyArray.reduce((sum, day) => sum + day.minutes, 0),
            },
          });
        }
      );
    }
  );
});

module.exports = router;
