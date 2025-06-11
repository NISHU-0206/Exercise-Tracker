const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static HTML/CSS/JS from "public" directory
app.use(express.static('public'));

// API routes
app.use('/api/users', userRoutes);

// Handle invalid root or other routes (optional)
app.use((req, res, next) => {
  if (req.path === '/') return next();
  return res.status(404).json({ error: 'Not Found' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
