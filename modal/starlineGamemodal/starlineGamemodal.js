const mongoose = require("mongoose");

const starlineGameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  gameDate: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

starlineGameSchema.index({ gameDate: 1 });

module.exports = mongoose.model("StarlineGame", starlineGameSchema);
