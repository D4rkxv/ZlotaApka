const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  db.get(
    `SELECT
    up.hydration_goal,
    up.sleep_goal_hours,
    up.sleep_goal_minutes,
    up.in_bed_time,
    up.out_of_bed_time,
    up.calories_goal,
    up.current_weight,
    up.goal_weight,
    up.gender,
    up.daily_activity,
    up.weekly_workouts,
    up.current_height,
    up.current_age,
    up.water_cycle_start,
    up.onboarding_completed,
    u.name,
    u.email,
    u.created_at
    FROM user_profiles up
    LEFT JOIN users u ON up.user_id = u.id
    WHERE up.user_id = ?`,
    [userId],
    (err, profile) => {
      if (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({
          status: "error",
          message: "Error fetching profile",
        });
      }

      if (!profile) {
        return res.status(404).json({
          status: "error",
          message: "Profile not found",
        });
      }

      res.json({
        status: "success",
        data: profile,
      });
    }
  );
});

router.put("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const {
    hydration_goal,
    sleep_goal_hours,
    sleep_goal_minutes,
    in_bed_time,
    out_of_bed_time,
    calories_goal,
    current_weight,
    goal_weight,
    gender,
    daily_activity,
    weekly_workouts,
    current_height,
    current_age,
    water_cycle_start,
    onboarding_completed,
  } = req.body;

  db.run(
    `UPDATE user_profiles SET
      hydration_goal = COALESCE(?, hydration_goal),
      sleep_goal_hours = COALESCE(?, sleep_goal_hours),
      sleep_goal_minutes = COALESCE(?, sleep_goal_minutes),
      in_bed_time = COALESCE(?, in_bed_time),
      out_of_bed_time = COALESCE(?, out_of_bed_time),
      calories_goal = COALESCE(?, calories_goal),
      current_weight = COALESCE(?, current_weight),
      goal_weight = COALESCE(?, goal_weight),
      gender = COALESCE(?, gender),
      daily_activity = COALESCE(?, daily_activity),
      weekly_workouts = COALESCE(?, weekly_workouts),
      current_height = COALESCE(?, current_height),
      current_age = COALESCE(?, current_age),
      water_cycle_start = COALESCE(?, water_cycle_start),
      onboarding_completed = COALESCE(?, onboarding_completed)
    WHERE user_id = ?`,
    [
      hydration_goal,
      sleep_goal_hours,
      sleep_goal_minutes,
      in_bed_time,
      out_of_bed_time,
      calories_goal,
      current_weight,
      goal_weight,
      gender,
      daily_activity,
      weekly_workouts,
      current_height,
      current_age,
      water_cycle_start,
      onboarding_completed,
      userId,
    ],
    function (err) {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({
          status: "error",
          message: "Error updating profile",
        });
      }

      db.get(
        `SELECT * FROM user_profiles WHERE user_id = ?`,
        [userId],
        (err, profile) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: "Error fetching updated profile",
            });
          }

          res.json({
            status: "success",
            data: profile,
          });
        }
      );
    }
  );
});

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images allowed"));
    cb(null, true);
  },
});

router.put("/name", authenticateToken, upload.single("image"), async (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  if (!name || name.trim() === "") {
    return res.status(400).json({ status: "error", message: "Name is required" });
  }

  db.run(`UPDATE users SET name = ? WHERE id = ?`, [name.trim(), userId], function (err) {
    if (err) return res.status(500).json({ status: "error", message: "Error updating name" });

    if (imageBuffer) {
      db.run(
        `UPDATE user_profiles SET profile_image = ? WHERE user_id = ?`,
        [imageBuffer, userId],
        function (err) {
          if (err) return res.status(500).json({ status: "error", message: "Error updating image" });
          res.json({ status: "success", data: { name: name.trim() } });
        }
      );
    } else {
      res.json({ status: "success", data: { name: name.trim() } });
    }
  });
});

router.get("/image", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  db.get(`SELECT profile_image FROM user_profiles WHERE user_id = ?`, [userId], (err, row) => {
    if (err || !row || !row.profile_image) {
      return res.status(404).json({ status: "error", message: "No profile image found" });
    }
    res.set("Content-Type", "image/jpeg");
    res.send(row.profile_image);
  });
});

router.put("/goals", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { daily_activity, hydration_goal, goal_weight } = req.body;

  if (daily_activity !== undefined && (!Number.isInteger(daily_activity) || daily_activity < 0)) {
    return res.status(400).json({ status: "error", message: "daily_activity must be a non-negative integer (minutes)" });
  }
  if (hydration_goal !== undefined && (typeof hydration_goal !== "number" || hydration_goal <= 0)) {
    return res.status(400).json({ status: "error", message: "hydration_goal must be a positive number" });
  }

  db.run(
    `UPDATE user_profiles SET
      daily_activity = COALESCE(?, daily_activity),
      hydration_goal = COALESCE(?, hydration_goal),
      goal_weight    = COALESCE(?, goal_weight)
    WHERE user_id = ?`,
    [daily_activity, hydration_goal, goal_weight, userId],
    function (err) {
      if (err) return res.status(500).json({ status: "error", message: "Error updating goals" });

      db.get(
        `SELECT daily_activity, hydration_goal, goal_weight FROM user_profiles WHERE user_id = ?`,
        [userId],
        (err, profile) => {
          if (err) return res.status(500).json({ status: "error", message: "Error fetching updated goals" });
          res.json({ status: "success", data: profile });
        }
      );
    }
  );
});

module.exports = router;
