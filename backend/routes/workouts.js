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

  query += ` ORDER BY date DESC, time DESC LIMIT ?`;
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
  const {
    date,
    time,
    activity_type,
    activity_name,
    duration_minutes,
    calories_burned,
  } = req.body;

  if (!activity_type || !duration_minutes) {
    return res.status(400).json({
      status: "error",
      message: "Activity type and duration are required",
    });
  }

  const workoutDate = date || new Date().toISOString().split("T")[0];
  const workoutTime =
    time ||
    new Date().toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  db.run(
    `INSERT INTO workouts (user_id, date, time, activity_type, activity_name ,duration_minutes, calories_burned) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      workoutDate,
      workoutTime,
      activity_type,
      activity_name,
      duration_minutes,
      calories_burned || null,
    ],
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
          activity_name,
          duration_minutes,
          calories_burned,
        },
      });
    },
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
    },
  );
});

router.get("/stats", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const today = new Date().toISOString().split("T")[0];

  const getLastWeekDates = () => {
    const now = req.query.date ? new Date(req.query.date) : new Date();
    const dayOfWeek = now.getDay();

    const monday = new Date(now);
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(now.getDate() - daysFromMonday);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push(date.toISOString().split("T")[0]);
    }
    return weekDays;
  };

  const lastWeekDays = getLastWeekDates();

  db.all(
    `SELECT date, SUM(duration_minutes) as total_minutes, SUM(calories_burned) as total_calories, COUNT(*) as count
      FROM workouts 
      WHERE user_id = ? AND date IN (${lastWeekDays.map(() => "?").join(",")})
      GROUP BY date`,
    [userId, ...lastWeekDays],
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

      const weeklyArray = lastWeekDays.map((date) => ({
        date,
        minutes: statsByDate[date]?.minutes || 0,
        calories: statsByDate[date]?.calories || 0,
        count: statsByDate[date]?.count || 0,
      }));

      const weeklyTotal = weeklyArray.reduce(
        (sum, day) => sum + day.minutes,
        0,
      );

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
              weeklyTotal: weeklyTotal,
            },
          });
        },
      );
    },
  );
});

module.exports = router;
