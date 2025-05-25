const mongoose = require('mongoose');

const galidesawarBetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'GalidesawarGame', required: true },
  betType: { type: String, enum: ['left', 'right', 'jodi'], required: true },
  number: { type: String, required: true }, // left (0-9), right (0-9), jodi (00-99)
  amount: { type: Number, required: true },
  isWinner: { type: Boolean, default: false }
});

module.exports = mongoose.model('GalidesawarBet', galidesawarBetSchema);
