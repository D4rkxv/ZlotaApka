require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const waterRoutes = require("./routes/water");
const workoutsRoutes = require("./routes/workouts");
const sleepRoutes = require("./routes/sleep");
const mealsRoutes = require("./routes/meals");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/meals", mealsRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  db.close((err) => {
    if (err) console.error("Error closing DB:", err);
    else console.log("Database closed");
    process.exit(0);
  });
});
