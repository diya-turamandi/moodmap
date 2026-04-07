const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("MoodMap Backend Running 🚀");
});
app.post("/api/mood", (req, res) => {
  const { mood, budget, time, location } = req.body;

  let suggestion = "";

  if (mood === "Happy 😊") {
    suggestion = `🎉 Enjoy a fun outing within ₹${budget} in ${location || "your city"}`;
  } else if (mood === "Sad 😔") {
    suggestion = `🌿 Visit a peaceful park or listen to music for ${time}`;
  } else if (mood === "Stressed 😫") {
    suggestion = `🧘 Try meditation or a calm walk nearby`;
  } else if (mood === "Bored 😐") {
    suggestion = `☕ Explore a new cafe or watch a movie`;
  } else {
    suggestion = "✨ Try something new today!";
  }

  res.json({ suggestion });
});
// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});