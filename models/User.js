const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [ExerciseSchema]
});

module.exports = mongoose.model("User", UserSchema);
