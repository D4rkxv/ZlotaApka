const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "error", message: "Database error" });
        }

        if (user) {
          return res
            .status(400)
            .json({ status: "error", message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
          [email, hashedPassword, name || null],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ status: "error", message: "Error saving user" });
            }

            const userId = this.lastID;

            db.run(
              "INSERT INTO user_profiles (user_id) VALUES (?)",
              [userId],
              (err) => {
                if (err) {
                  console.error("Error creating user profile:", err.message);
                }
              }
            );

            const token = jwt.sign({ userId, email }, process.env.JWTSECRET, {
              expiresIn: "30d",
            });

            res.status(201).json({
              status: "success",
              data: {
                token,
                user: { id: userId, email, name: name || null },
              },
            });
          }
        );
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

router.post("/login", (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Server error",
      });
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWTSECRET,
      { expiresIn: rememberMe ? "30d" : "6h" }
    );

    res.json({
      status: "success",
      data: {
        token,
        rememberMe: !!rememberMe,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  });
});

router.get("/me", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(
    "SELECT id, email, name, created_at FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err || !user) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      res.json({
        status: "success",
        data: user,
      });
    }
  );
});

module.exports = router;
