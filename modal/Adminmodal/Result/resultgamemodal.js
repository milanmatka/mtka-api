// models/GameResult.js
const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  date: {
    type: String, // "2025-04-10"
    required: true,
  },
  openDigits: {
    type: [Number], // [2, 4, 7]
    required: true,
  },
  closeDigits: {
    type: [Number], // [3, 5, 6]
    required: true,
  },
  openSumDigit: {
    type: Number, // Last digit of open sum
  },
  closeSumDigit: {
    type: Number, // Last digit of close sum
  },
  finalDisplay: {
    type: String, // Formatted result like "247-3-356-4"
  }
}, { timestamps: true });

// Auto calculate sum digits and display format
gameResultSchema.pre("save", function (next) {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const lastDigit = (num) => num.toString().slice(-1);
  
    const openSum = sum(this.openDigits);
    const closeSum = sum(this.closeDigits);
  
    this.openSumDigit = parseInt(lastDigit(openSum));
    this.closeSumDigit = parseInt(lastDigit(closeSum));
  
    // vertical formatting
    const formatLines = this.openDigits.map((digit, index) => {
      const open = this.openDigits[index] || " ";
      const close = this.closeDigits[index] || " ";
      let middle = "     ";
      if (index === 0) {
        middle = `  ${this.openSumDigit} ${this.closeSumDigit}  `;
      }
      return `${open}   ${middle}   ${close}`;
    });
  
    this.finalDisplay = formatLines.join("\n");
    next();
  });
  
module.exports = mongoose.model("GameResult", gameResultSchema);
