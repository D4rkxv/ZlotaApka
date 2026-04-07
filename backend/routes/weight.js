const express = require("express");
const router = express.Router();
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");

router.get("/stats", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const today = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  db.get(
    `SELECT * FROM weight_logs WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1`,
    [userId, today],
    (err, todayRow) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });

      db.all(
        `SELECT date, weight FROM weight_logs WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date ASC`,
        [userId, weekStartStr, today],
        (err, weekRows) => {
          if (err)
            return res
              .status(500)
              .json({ status: "error", message: err.message });
          res.json({
            status: "success",
            data: { today: todayRow || null, weekly: weekRows || [] },
          });
        },
      );
    },
  );
});

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { date, limit = 30 } = req.query;

  let query = `SELECT * FROM weight_logs WHERE user_id = ?`;
  const params = [userId];
  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }
  query += ` ORDER BY date DESC, created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err)
      return res.status(500).json({ status: "error", message: err.message });
    res.json({ status: "success", data: rows });
  });
});

router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { weight, date } = req.body;

  if (!weight)
    return res
      .status(400)
      .json({ status: "error", message: "weight is required" });

  const entryDate = date || new Date().toISOString().split("T")[0];

  db.get(
    `SELECT id FROM weight_logs WHERE user_id = ? AND date = ?`,
    [userId, entryDate],
    (err, existing) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });

      if (existing) {
        db.run(
          `UPDATE weight_logs SET weight = ? WHERE id = ?`,
          [weight, existing.id],
          function (err) {
            if (err)
              return res
                .status(500)
                .json({ status: "error", message: err.message });
            res.json({
              status: "success",
              data: { id: existing.id, weight, date: entryDate },
            });
          },
        );
      } else {
        db.run(
          `INSERT INTO weight_logs (user_id, date, weight) VALUES (?, ?, ?)`,
          [userId, entryDate, weight],
          function (err) {
            if (err)
              return res
                .status(500)
                .json({ status: "error", message: err.message });
            res.json({
              status: "success",
              data: { id: this.lastID, weight, date: entryDate },
            });
          },
        );
      }
    },
  );
});

router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  db.run(
    `DELETE FROM weight_logs WHERE id = ? AND user_id = ?`,
    [req.params.id, userId],
    function (err) {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      res.json({ status: "success" });
    },
  );
});

module.exports = router;
