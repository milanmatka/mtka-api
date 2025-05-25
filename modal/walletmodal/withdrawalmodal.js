const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [100, 'Amount must be at least 100'],
  },
  method: {
    type: String,
    enum: ['UPI', 'Bank Transfer', 'PayPal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  note: {
    type: String,
  },
  transactionId: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
