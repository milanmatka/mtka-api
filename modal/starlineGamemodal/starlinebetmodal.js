const mongoose = require("mongoose");

const starlineBetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "StarlineGame" },
  gameType: { type: String, required: true },
  betNumber: { type: String },
  singleDigit: { type: Number },
  panaNumber: { type: String },
  openPana: { type: String },
  closePana: { type: String },
  closeDigit: { type: String },
  amount: { type: Number, required: true },
  betType: { type: String, enum: ['open', 'close'], required: true },
  status: { type: String, default: "pending" },
  winningAmount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StarlineBet", starlineBetSchema);
