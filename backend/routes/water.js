const express = require('express');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const { getLocalDateString } = require('../utils/date');

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { date, limit = 100 } = req.query;

  let query = `SELECT * FROM water_logs WHERE user_id = ?`;
  let params = [userId];

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }

  query += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching water logs:", err);
      return res.status(500).json({
        status: "error",
        message: "Error fetching water logs",
      });
    }

    res.json({
      status: "success",
      data: rows || [],
    });
  });
});

router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { amount, date, time } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Amount must be greater than 0",
    });
  }

  const logDate = date || getLocalDateString();
  const logTime = time || new Date().toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  db.run(
    `INSERT INTO water_logs (user_id, amount, date, time) VALUES (?, ?, ?, ?)`,
    [userId, amount, logDate, logTime],
    function (err) {
      if (err) {
        console.error("Error adding water log:", err);
        return res.status(500).json({
          status: "error",
          message: "Error adding water log",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          id: this.lastID,
          user_id: userId,
          amount,
          date: logDate,
          time: logTime,
        },
      });
    }
  );
});

router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  db.run(
    `DELETE FROM water_logs WHERE id = ? AND user_id = ?`,
    [id, userId],
    function (err) {
      if (err) {
        console.error("Error deleting water log:", err);
        return res.status(500).json({
          status: "error",
          message: "Error deleting water log",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          status: "error",
          message: "Water log not found",
        });
      }

      res.json({
        status: "success",
        message: "Water log deleted",
      });
    }
  );
});

router.get('/stats', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const currentDate = req.query.currentDate;
  const todayStr = currentDate || getLocalDateString();

  console.log("stats called with date:", todayStr);

  const today = new Date(todayStr + 'T12:00:00');

  db.get(
    `SELECT water_cycle_start FROM user_profiles WHERE user_id = ?`,
    [userId],
    (err, userRow) => {
      if (err) {
        console.error("Error fetching cycle start:", err);
        return res.status(500).json({
          status: "error",
          message: "Error fetching cycle start",
        });
      }

      let cycleStart;

      if (!userRow || !userRow.water_cycle_start) {
        cycleStart = todayStr;
        console.log("No cycle_start found, setting to:", cycleStart);

        db.run(
          `UPDATE user_profiles SET water_cycle_start = ? WHERE user_id = ?`,
          [cycleStart, userId],
          (err) => {
            if (err) console.error("Error updating cycle start:", err);
            else console.log("Cycle start updated to:", cycleStart);
          }
        );
      } else {
        cycleStart = userRow.water_cycle_start;
        const cycleStartDate = new Date(cycleStart + 'T12:00:00');
        const daysSinceStart = Math.floor((today - cycleStartDate) / (1000 * 60 * 60 * 24));

        if (daysSinceStart >= 12) {
          const newCycleStart = todayStr;
          console.log("RESETTING CYCLE from", cycleStart, "to", newCycleStart);
          cycleStart = newCycleStart;

          db.run(
            `UPDATE user_profiles SET water_cycle_start = ? WHERE user_id = ?`,
            [cycleStart, userId],
            (err) => {
              if (err) console.error("Error resetting cycle start:", err);
              else console.log("Cycle reset successful to:", cycleStart);
            }
          );
        }
      }

      const twelve_day = [];
      const cycleStartDate = new Date(cycleStart + 'T12:00:00');

      for (let i = 0; i < 12; i++) {
        const date = new Date(cycleStartDate);
        date.setDate(cycleStartDate.getDate() + i);
        const dateStr = getLocalDateString(date);

        twelve_day.push({
          date: dateStr,
          amount: 0,
          day_index: i
        });
      }

      const dates = twelve_day.map(d => d.date);
      const placeholders = dates.map(() => '?').join(',');

      db.all(
        `SELECT date, SUM(amount) as amount
         FROM water_logs
         WHERE user_id = ? AND date IN (${placeholders})
         GROUP BY date`,
        [userId, ...dates],
        (err, rows) => {
          if (err) {
            console.error("Error fetching water data:", err);
            return res.status(500).json({
              status: "error",
              message: "Error fetching water data",
            });
          }

          rows.forEach(row => {
            const dayData = twelve_day.find(d => d.date === row.date);
            if (dayData) {
              dayData.amount = parseFloat(row.amount);
            }
          });

          const weekly = twelve_day.slice(0, 7);


          res.json({
            status: 'success',
            data: {
              weekly: weekly.map(d => ({ date: d.date, amount: d.amount })),
              twelve_day: twelve_day.map(d => ({ date: d.date, amount: d.amount })),
              cycle_start: cycleStart,
              days_in_cycle: twelve_day.length
            }
          });
        }
      );
    }
  );
});

module.exports = router;
