const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  db.get(
    `SELECT
      up.*,
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
    current_height, // DODAJ TO
    current_age, // DODAJ TO
    onboarding_completed, // DODAJ TO
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

router.put("/name", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Name is required",
    });
  }

  db.run(
    `UPDATE users SET name = ? WHERE id = ?`,
    [name.trim(), userId],
    function (err) {
      if (err) {
        console.error("Error updating name:", err);
        return res.status(500).json({
          status: "error",
          message: "Error updating name",
        });
      }

      res.json({
        status: "success",
        data: { name: name.trim() },
      });
    }
  );
});

module.exports = router;
