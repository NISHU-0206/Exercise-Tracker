const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Create user
router.post("/", async (req, res) => {
  const user = new User({ username: req.body.username });
  const savedUser = await user.save();
  res.json({ username: savedUser.username, _id: savedUser._id });
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find({}, "username _id");
  res.json(users);
});

// Add exercise
router.post("/:id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.send("User not found");

  const exerciseDate = date ? new Date(date) : new Date();
  user.log.push({ description, duration: parseInt(duration), date: exerciseDate });
  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString(),
  });
});

// Get logs
router.get("/:id/logs", async (req, res) => {
  const { from, to, limit } = req.query;
  const user = await User.findById(req.params.id);
  if (!user) return res.send("User not found");

  let log = [...user.log];

  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log.map(e => ({
      description: e.description,
      duration: e.duration,
      date: new Date(e.date).toDateString(),
    })),
  });
});

module.exports = router;
