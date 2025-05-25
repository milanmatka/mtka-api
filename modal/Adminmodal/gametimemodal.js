const mongoose = require('mongoose');

const gameTimeSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
    enum: [
      'KALYAN MORNING',
      'MAIN BAZAR',
      'KARNATAKA DAY',
      'SRIDEV MORNING',
      'MADHUR MORNING',
      'PADMAVATI',
      'MILAN MORNING',
    ]
  },
  date: {
    type: Date,
    required: true
  },
  openingTime: {
    type: Date,
    default: null
  },
  closingTime: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('GameTime', gameTimeSchema);
