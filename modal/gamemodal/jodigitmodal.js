const mongoose = require('mongoose');

const jodiSchema = new mongoose.Schema({
  jodiNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{2}$/.test(v); // Only allows strings like "00" to "99"
      },
      message: props => `${props.value} is not a valid 2-digit number!`
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Jodi', jodiSchema);
