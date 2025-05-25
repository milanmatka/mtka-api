const mongoose = require('mongoose');

const singlePanaSchema = new mongoose.Schema({
  panaNumber: {
    type: String,
    required: true,
    match: /^[0-9]{3}$/,
  },
  amount: {
    type: Number,
    required: true,
  },
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
    ],
  },
  gameDate: {
    type: String,
    required: true,
  },
  betType: {
    type: String,
    enum: ['open', 'close'],
    required: true,
  },
  // betTime: {
  //   type: String, // Example: "03:00 PM"
  //   required: true,
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SinglePana', singlePanaSchema);
