const mongoose = require('mongoose');

const homeDpSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeDp', homeDpSchema);
