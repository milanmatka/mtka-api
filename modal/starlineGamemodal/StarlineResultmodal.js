const mongoose = require("mongoose");

const starlineResultSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "StarlineGame", required: true },
  openDigits: { type: String, required: true },
  closeDigits: { type: String, required: true },
  openResult: { type: String, required: true },
  closeResult: { type: String, required: true },
  jodiResult: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("StarlineResult", starlineResultSchema);
