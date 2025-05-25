const Withdrawal = require('../../modal/walletmodal/withdrawalmodal');
const Wallet = require('../../modal/walletmodal/walletmodal');
// const mongoose = require('mongoose');

// Create withdrawal
exports.createWithdrawal = async (req, res) => {
    try {
      const { amount, method, note } = req.body;
      const userId = req.user._id;
  
      // Validation
      if (!amount || amount < 100) {
        return res.status(400).json({ success: false, message: 'Amount must be at least 100' });
      }
      if (!method || !['UPI', 'Bank Transfer', 'PayPal'].includes(method)) {
        return res.status(400).json({ success: false, message: 'Invalid withdrawal method' });
      }
  
      // Check wallet balance
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
  
      // Deduct amount immediately
      wallet.balance -= amount;
      wallet.transactions.push({
        amount,
        type: 'debit',
        note: `Withdrawal request created`,
      });
      await wallet.save();
  
      const newWithdrawal = new Withdrawal({
        userId,
        amount,
        method,
        note,
      });
  
      await newWithdrawal.save();
      res.status(201).json({ success: true, message: 'Withdrawal request created and amount deducted', data: newWithdrawal });
  
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating withdrawal', error: error.message });
    }
  };
  

// Get withdrawals
exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({}).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching withdrawals', error: error.message });
  }
};

// Approve/Reject Withdrawal (Admin)
exports.updateWithdrawalStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, transactionId, note } = req.body;
  
      const withdrawal = await Withdrawal.findById(id);
      if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
  
      if (withdrawal.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Withdrawal already processed' });
      }
  
      const wallet = await Wallet.findOne({ user: withdrawal.userId });
  
      // Refund if rejected
      if (status === 'Rejected') {
        wallet.balance += withdrawal.amount;
        wallet.transactions.push({
          amount: withdrawal.amount,
          type: 'credit',
          note: 'Refund for rejected withdrawal',
        });
        await wallet.save();
      }
  
      // (No action needed if Approved, amount already deducted)
  
      withdrawal.status = status;
      withdrawal.transactionId = transactionId || withdrawal.transactionId;
      withdrawal.note = note || withdrawal.note;
      await withdrawal.save();
  
      res.status(200).json({ success: true, message: `Withdrawal ${status.toLowerCase()}`, data: withdrawal });
  
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating withdrawal', error: error.message });
    }
  };
  