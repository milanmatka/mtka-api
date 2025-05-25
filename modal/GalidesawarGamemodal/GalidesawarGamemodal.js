// models/GalidesawarGame.js
const mongoose = require('mongoose');

const galidesawarGameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  closeTime: { type: String, required: true }, // Format: 'HH:mm'
  result: {
    left: { type: String },
    right: { type: String },
    jodi: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalidesawarGame', galidesawarGameSchema);
