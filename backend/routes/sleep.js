const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { date, limit = 30 } = req.query;

  let query = `SELECT * FROM sleep_logs WHERE user_id = ?`;
  let params = [userId];

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }

  query += ` ORDER BY date DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching sleep logs:", err);
      return res.status(500).json({
        status: "error",
        message: "Error fetching sleep logs",
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
  const { date, in_bed_time, out_of_bed_time, sleep_quality, notes } = req.body;

  if (!in_bed_time || !out_of_bed_time) {
    return res.status(400).json({
      status: "error",
      message: "In bed time and out of bed time are required",
    });
  }

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const bedMinutes = timeToMinutes(in_bed_time);
  const outMinutes = timeToMinutes(out_of_bed_time);
  let sleepMinutes = outMinutes >= bedMinutes
    ? outMinutes - bedMinutes
    : outMinutes + (24 * 60) - bedMinutes;

  const sleepHours = sleepMinutes / 60;

  const qualityMap = { poor: 1, average: 2, good: 3, excellent: 4 };
  const qualityNum = qualityMap[sleep_quality] || 2;
  const durationScore = Math.min((sleepHours / 8) * 100, 100);
  const qualityScore = ((qualityNum - 1) / 3) * 100;
  const sleepScore = Math.round(0.7 * durationScore + 0.3 * qualityScore);

  const sleepDate = date || new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO sleep_logs (user_id, date, in_bed_time, out_of_bed_time, sleep_quality, notes, duration_hours, sleep_score) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, sleepDate, in_bed_time, out_of_bed_time, sleep_quality || null, notes || null, sleepHours, sleepScore],
    function (err) {
      if (err) {
        console.error("Error adding sleep log:", err);
        return res.status(500).json({
          status: "error",
          message: "Error adding sleep log",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          id: this.lastID,
          user_id: userId,
          date: sleepDate,
          in_bed_time,
          out_of_bed_time,
          sleep_quality,
          notes,
          duration_hours: sleepHours,
          sleep_score: sleepScore,
        },
      });
    }
  );
});

router.put("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { in_bed_time, out_of_bed_time, sleep_quality, notes } = req.body;

  let updateFields = [];
  let updateValues = [];

  if (in_bed_time && out_of_bed_time) {
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const bedMinutes = timeToMinutes(in_bed_time);
    const outMinutes = timeToMinutes(out_of_bed_time);
    let sleepMinutes = outMinutes >= bedMinutes
      ? outMinutes - bedMinutes
      : outMinutes + (24 * 60) - bedMinutes;

    const sleepHours = sleepMinutes / 60;

    const qualityMap = { poor: 1, average: 2, good: 3, excellent: 4 };
    const qualityNum = qualityMap[sleep_quality] || 2;
    const durationScore = Math.min((sleepHours / 8) * 100, 100);
    const qualityScore = ((qualityNum - 1) / 3) * 100;
    const sleepScore = Math.round(0.7 * durationScore + 0.3 * qualityScore);

    updateFields.push("in_bed_time = ?", "out_of_bed_time = ?", "duration_hours = ?", "sleep_score = ?");
    updateValues.push(in_bed_time, out_of_bed_time, sleepHours, sleepScore);
  }

  if (sleep_quality !== undefined) {
    updateFields.push("sleep_quality = ?");
    updateValues.push(sleep_quality);
  }

  if (notes !== undefined) {
    updateFields.push("notes = ?");
    updateValues.push(notes);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No fields to update",
    });
  }

  updateValues.push(id, userId);

  db.run(
    `UPDATE sleep_logs SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`,
    updateValues,
    function (err) {
      if (err) {
        console.error("Error updating sleep log:", err);
        return res.status(500).json({
          status: "error",
          message: "Error updating sleep log",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          status: "error",
          message: "Sleep log not found",
        });
      }

      res.json({
        status: "success",
        message: "Sleep log updated",
      });
    }
  );
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  db.run(
    `DELETE FROM sleep_logs WHERE id = ? AND user_id = ?`,
    [id, userId],
    function (err) {
      if (err) {
        console.error("Error deleting sleep log:", err);
        return res.status(500).json({
          status: "error",
          message: "Error deleting sleep log",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          status: "error",
          message: "Sleep log not found",
        });
      }

      res.json({
        status: "success",
        message: "Sleep log deleted",
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
    `SELECT date, duration_hours, sleep_score, sleep_quality 
     FROM sleep_logs 
     WHERE user_id = ? AND date IN (${last7Days.map(() => "?").join(",")})
     ORDER BY date`,
    [userId, ...last7Days],
    (err, weeklyData) => {
      if (err) {
        console.error("Error fetching sleep stats:", err);
        return res.status(500).json({
          status: "error",
          message: "Error fetching sleep stats",
        });
      }

      const sleepByDate = {};
      weeklyData.forEach((row) => {
        sleepByDate[row.date] = {
          hours: row.duration_hours || 0,
          score: row.sleep_score || 0,
          quality: row.sleep_quality,
        };
      });

      const weeklyArray = last7Days.map((date) => ({
        date,
        hours: sleepByDate[date]?.hours || 0,
        score: sleepByDate[date]?.score || 0,
        quality: sleepByDate[date]?.quality || null,
      }));

      db.get(
        `SELECT * FROM sleep_logs WHERE user_id = ? AND date = ?`,
        [userId, today],
        (err, todaySleep) => {
          if (err) {
            console.error("Error fetching today's sleep:", err);
            return res.status(500).json({
              status: "error",
              message: "Error fetching today's sleep",
            });
          }

          res.json({
            status: "success",
            data: {
              today: todaySleep || null,
              weekly: weeklyArray,
            },
          });
        }
      );
    }
  );
});

module.exports = router;