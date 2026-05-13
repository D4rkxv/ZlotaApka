const express = require("express");
const router = express.Router();
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");
const { getLocalDateString } = require("../utils/date");

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const date = req.query.date || getLocalDateString();

  db.get(
    "SELECT * FROM daily_challenge WHERE user_id = ? AND date = ?",
    [userId, date],
    (err, row) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      if (!row) return res.json({ status: "success", data: null });
      try {
        const challenge = JSON.parse(row.challenge_json);
        return res.json({
          status: "success",
          data: { challenge, date: row.date },
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
  const userId = req.user.userId;
  const { challenge, date } = req.body;

  if (!challenge || !date) {
    return res
      .status(400)
      .json({ status: "error", message: "challenge and date required" });
  }

  db.run(
    `INSERT INTO daily_challenge (user_id, challenge_json, date)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET challenge_json = excluded.challenge_json`,
    [userId, JSON.stringify(challenge), date],
    function (err) {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      return res.json({ status: "success", data: { challenge, date } });
    },
  );
});

router.patch("/:itemId", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.params;
  const { date, completed } = req.body;

  if (!date || completed === undefined) {
    return res
      .status(400)
      .json({ status: "error", message: "date and completed are required" });
  }

  db.get(
    "SELECT * FROM daily_challenge WHERE user_id = ? AND date = ?",
    [userId, date],
    (err, row) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      if (!row)
        return res
          .status(404)
          .json({ status: "error", message: "Challenge not found for this date" });

      let challenge;
      try {
        challenge = JSON.parse(row.challenge_json);
      } catch {
        return res
          .status(500)
          .json({ status: "error", message: "Invalid JSON in DB" });
      }

      const updated = challenge.map((item) =>
        item.id === itemId ? { ...item, completed: !!completed } : item
      );

      db.run(
        "UPDATE daily_challenge SET challenge_json = ? WHERE user_id = ? AND date = ?",
        [JSON.stringify(updated), userId, date],
        function (err) {
          if (err)
            return res
              .status(500)
              .json({ status: "error", message: err.message });
          return res.json({ status: "success", data: { id: itemId, completed } });
        }
      );
    }
  );
});

module.exports = router;
