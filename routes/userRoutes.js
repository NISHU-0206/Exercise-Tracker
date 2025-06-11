const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    const user = new User({ username });
    const savedUser = await user.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username _id");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

// POST /api/users/:id/exercises
router.post("/:id/exercises", async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exerciseDate = date ? new Date(date) : new Date();

    const exercise = {
      description,
      duration: parseInt(duration),
      date: exerciseDate
    };

    user.log.push(exercise);
    await user.save();

    res.json({
      username: user.username,
      description,
      duration: parseInt(duration),
      date: exerciseDate.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

// GET /api/users/:id/logs
router.get("/:id/logs", async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let log = user.log;

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
      username: user.username,
      count: log.length,
      _id: user._id,
      log: log.map(e => ({
        description: e.description,
        duration: e.duration,
        date: new Date(e.date).toDateString()
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get logs" });
  }
});

module.exports = router;
