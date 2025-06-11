const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });
  try {
    const newUser = new User({ username });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// POST add exercise to a user
router.post('/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json({ error: 'Invalid user ID' });
  if (!description || !duration)
    return res.status(400).json({ error: 'Description and duration are required' });

  const user = await User.findById(_id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const parsedDuration = parseInt(duration);
  const exerciseDate = date ? new Date(date) : new Date();

  const ex = new Exercise({
    userId: user._id,
    description,
    duration: parsedDuration,
    date: exerciseDate
  });
  await ex.save();

  return res.json({
    _id: user._id.toString(),
    username: user.username,
    date: exerciseDate.toDateString(),
    duration: parsedDuration,
    description
  });
});


// GET user's exercise log
router.get('/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json({ error: 'Invalid user ID' });

  const user = await User.findById(_id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const filter = { userId: user._id };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);

  let exercises = await Exercise.find(filter).sort({ date: 1 });
  if (limit) exercises = exercises.slice(0, parseInt(limit));

  const log = exercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  return res.json({
    _id: user._id.toString(),
    username: user.username,
    count: log.length,
    log
  });
});

module.exports = router;
