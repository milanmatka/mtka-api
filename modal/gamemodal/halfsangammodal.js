const mongoose = require('mongoose');

const halfSangamSchema = new mongoose.Schema({
  singleDigit: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  panaNumber: {
    type: String,
    required: true,
    match: /^[0-9]{3}$/ // Must be 3 digits, e.g., "123"
  },
  amount: {
    type: Number,
    required: true
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
    ]
  },
  gameDate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  openingTime: {
    type: Date,
    default: null
  },
  closingTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Only one of openingTime or closingTime must be set
halfSangamSchema.pre('validate', function (next) {
  if (this.openingTime && this.closingTime) {
    return next(new Error('Only one of openingTime or closingTime can be set.'));
  }
  if (!this.openingTime && !this.closingTime) {
    return next(new Error('You must set either openingTime or closingTime.'));
  }
  next();
});

module.exports = mongoose.model('HalfSangam', halfSangamSchema);
