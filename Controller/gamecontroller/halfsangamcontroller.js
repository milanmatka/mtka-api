const HalfSangam = require('../../modal/gamemodal/halfsangammodal');
const Wallet = require('../../modal/walletmodal/walletmodal');

// 🔹 Add a Half Sangam Entry
exports.addHalfSangam = async (req, res) => {
  try {
    const { singleDigit, panaNumber, amount, openingTime,gameDate, closingTime, gameType } = req.body;
    const userId = req.user.id; // Assuming auth middleware

    // 🔸 Game type validation
    if (!gameType) {
      return res.status(400).json({ message: "Game type is required" });
    }

    // 🔸 Opening/Closing time validation
    if ((openingTime && closingTime) || (!openingTime && !closingTime)) {
      return res.status(400).json({
        message: "Provide either openingTime or closingTime (not both or none)"
      });
    }

    // 🔸 Wallet check and deduction
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient wallet balance' });

    // 🔸 Deduct from wallet and log transaction
    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Half Sangam bet placed: ${singleDigit}-${panaNumber}`
    });
    await wallet.save();

    // 🔸 Save Half Sangam Entry
    const entry = new HalfSangam({
      singleDigit,
      panaNumber,
      amount,
      gameType,
      gameDate,
      user: userId,
      openingTime: openingTime || null,
      closingTime: closingTime || null,
    });

    await entry.save();
    const populatedEntry = await HalfSangam.findById(entry._id).populate('user', 'name email');

    res.status(201).json({
      message: 'Half Sangam entry created and balance deducted',
      walletBalance: wallet.balance,
      data: {
        id: populatedEntry._id,
        singleDigit: populatedEntry.singleDigit,
        panaNumber: populatedEntry.panaNumber,
        amount: populatedEntry.amount,
        gameType: populatedEntry.gameType,
        gameDate: populatedEntry.gameDate,
        openingTime: populatedEntry.openingTime,
        closingTime: populatedEntry.closingTime,
        createdAt: populatedEntry.createdAt,
        user: {
          id: populatedEntry.user._id,
          name: populatedEntry.user.name,
          email: populatedEntry.user.email,
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔹 Get All Half Sangam Entries
exports.getAllHalfSangam = async (req, res) => {
  try {
    const entries = await HalfSangam.find().populate('user', 'name email');
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Entries by User
exports.getHalfSangamByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await HalfSangam.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Entry
exports.deleteHalfSangam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HalfSangam.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Entry
exports.updateHalfSangam = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HalfSangam.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
