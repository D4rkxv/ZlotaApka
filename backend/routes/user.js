const express = require("express");
const router = express.Router();
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");

router.delete("/reset-data", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.serialize(() => {
    db.run("DELETE FROM workouts WHERE user_id = ?", [userId]);
    db.run("DELETE FROM meals WHERE user_id = ?", [userId]);
    db.run("DELETE FROM water_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM sleep_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM weight_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM daily_workout WHERE user_id = ?", [userId]);
    db.run("DELETE FROM daily_challenge WHERE user_id = ?", [userId], (err) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      return res.json({ status: "success", message: "All data deleted" });
    });
  });
});

router.delete("/delete-account", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.serialize(() => {
    db.run("DELETE FROM workouts WHERE user_id = ?", [userId]);
    db.run("DELETE FROM meals WHERE user_id = ?", [userId]);
    db.run("DELETE FROM water_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM sleep_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM weight_logs WHERE user_id = ?", [userId]);
    db.run("DELETE FROM daily_workout WHERE user_id = ?", [userId]);
    db.run("DELETE FROM daily_challenge WHERE user_id = ?", [userId]);
    db.run("DELETE FROM user_profiles WHERE user_id = ?", [userId]);
    db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
      if (err)
        return res.status(500).json({ status: "error", message: err.message });
      return res.json({ status: "success", message: "Account deleted" });
    });
  });
});

module.exports = router;
