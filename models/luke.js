const mongoose = require('mongoose');

const lukeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  options: [String],
  video_url: String,
  correct_answer: { type: String, required: true }
});

module.exports = mongoose.model('Luke', lukeSchema);

