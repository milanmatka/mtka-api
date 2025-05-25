const mongoose = require('mongoose');

const qrDpSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QRCode', qrDpSchema);
