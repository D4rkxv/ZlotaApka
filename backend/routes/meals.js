const express = require("express");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { date, meal_type, limit = 100 } = req.query;

  let query = `SELECT * FROM meals WHERE user_id = ?`;
  let params = [userId];

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }

  if (meal_type) {
    query += ` AND meal_type = ?`;
    params.push(meal_type);
  }

  query += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching meals:", err);
      return res.status(500).json({
        status: "error",
        message: "Error fetching meals",
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
  const { date, time, meal_type, food_name, calories, protein, carbs, fats, notes } = req.body;

  if (!meal_type || !food_name || !calories) {
    return res.status(400).json({
      status: "error",
      message: "Meal type, food name, and calories are required",
    });
  }

  const mealDate = date || new Date().toISOString().split("T")[0];
  const mealTime = time || new Date().toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  db.run(
    `INSERT INTO meals (user_id, date, time, meal_type, food_name, calories, protein, carbs, fats, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, mealDate, mealTime, meal_type, food_name, calories, protein || null, carbs || null, fats || null, notes || null],
    function (err) {
      if (err) {
        console.error("Error adding meal:", err);
        return res.status(500).json({
          status: "error",
          message: "Error adding meal",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          id: this.lastID,
          user_id: userId,
          date: mealDate,
          time: mealTime,
          meal_type,
          food_name,
          calories,
          protein,
          carbs,
          fats,
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
    `DELETE FROM meals WHERE id = ? AND user_id = ?`,
    [id, userId],
    function (err) {
      if (err) {
        console.error("Error deleting meal:", err);
        return res.status(500).json({
          status: "error",
          message: "Error deleting meal",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          status: "error",
          message: "Meal not found",
        });
      }

      res.json({
        status: "success",
        message: "Meal deleted",
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
    `SELECT meal_type, SUM(calories) as total_calories, SUM(protein) as total_protein, 
            SUM(carbs) as total_carbs, SUM(fats) as total_fats, COUNT(*) as count
     FROM meals 
     WHERE user_id = ? AND date = ?
     GROUP BY meal_type`,
    [userId, today],
    (err, todayMeals) => {
      if (err) {
        console.error("Error fetching today's meals:", err);
        return res.status(500).json({
          status: "error",
          message: "Error fetching today's meals",
        });
      }

      db.all(
        `SELECT date, SUM(calories) as total_calories 
         FROM meals 
         WHERE user_id = ? AND date IN (${last7Days.map(() => "?").join(",")})
         GROUP BY date`,
        [userId, ...last7Days],
        (err, weeklyData) => {
          if (err) {
            console.error("Error fetching weekly meals:", err);
            return res.status(500).json({
              status: "error",
              message: "Error fetching weekly meals",
            });
          }

          const caloriesByDate = {};
          weeklyData.forEach((row) => {
            caloriesByDate[row.date] = row.total_calories || 0;
          });

          const weeklyArray = last7Days.map((date) => ({
            date,
            calories: caloriesByDate[date] || 0,
          }));

          const todayTotals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
          };

          const mealsByType = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
          };

          todayMeals.forEach((meal) => {
            todayTotals.calories += meal.total_calories || 0;
            todayTotals.protein += meal.total_protein || 0;
            todayTotals.carbs += meal.total_carbs || 0;
            todayTotals.fats += meal.total_fats || 0;
          });

          db.all(
            `SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY created_at DESC`,
            [userId, today],
            (err, allTodayMeals) => {
              if (err) {
                console.error("Error fetching all today's meals:", err);
                return res.status(500).json({
                  status: "error",
                  message: "Error fetching all today's meals",
                });
              }

              allTodayMeals.forEach((meal) => {
                if (mealsByType[meal.meal_type]) {
                  mealsByType[meal.meal_type].push(meal);
                }
              });

              res.json({
                status: "success",
                data: {
                  today: {
                    totals: todayTotals,
                    byType: mealsByType,
                  },
                  weekly: weeklyArray,
                },
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
