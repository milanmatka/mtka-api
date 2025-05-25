const mongoose = require('mongoose');

const triplePanaSchema = new mongoose.Schema({
  panaNumber: {
    type: String,
    required: true,
    match: /^[0-9]{3}$/,
    validate: {
      validator: function (val) {
        const [a, b, c] = val.split('');
        return (a === b && b == c) || (b === c && a == b);
      },
      message: 'Triple Pana must be in AAB or ABB format (e.g., 112 or 221)'
    }
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
  betType: {
    type: String,
    enum: ['open', 'close'],
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('TriplePana', triplePanaSchema);
