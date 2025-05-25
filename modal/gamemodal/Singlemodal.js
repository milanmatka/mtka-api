const mongoose = require('mongoose');

const singleDigitSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true, // you can change to false if optional
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
  digit: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  amount: {
    type: Number,
    required: true
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
  isOpenClosed: {
    type: String,
    enum: ['open', 'close'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom validation: only one of openingTime or closingTime should be set
singleDigitSchema.pre('validate', function (next) {
  if (this.openingTime && this.closingTime) {
    return next(new Error('Only one of openingTime or closingTime can be set.'));
  }
  if (!this.openingTime && !this.closingTime) {
    return next(new Error('You must set either openingTime or closingTime.'));
  }
  next();
});

module.exports = mongoose.model('SingleDigit', singleDigitSchema);
