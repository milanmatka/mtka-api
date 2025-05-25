const mongoose = require('mongoose');

const doublePanaSchema = new mongoose.Schema({
  panaNumber: {
    type: String,
    required: true,
    match: /^[0-9]{3}$/,
    validate: {
      validator: function (val) {
        const [a, b, c] = val.split('');
        return (a === b && b !== c) || (b === c && a !== b);
      },
      message: 'Double Pana must be in AAB or ABB format (e.g., 112 or 221)'
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('DoublePana', doublePanaSchema);
