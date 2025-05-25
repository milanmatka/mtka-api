const FullSangam = require('../../modal/gamemodal/fullsangammodal');
const Wallet = require('../../modal/walletmodal/walletmodal');

// 🔹 Add a Full Sangam Entry
exports.addFullSangam = async (req, res) => {
  try {
    const { openPana, closePana, amount,gameDate, openingTime, closingTime, gameType } = req.body;
    const userId = req.user.id;

    // 🔸 Game type check
    if (!gameType) {
      return res.status(400).json({ message: "Game type is required" });
    }

    // 🔸 Validate opening/closing time
    if ((openingTime && closingTime) || (!openingTime && !closingTime)) {
      return res.status(400).json({
        message: "Provide either openingTime or closingTime (not both or none)"
      });
    }

    // 🔸 Wallet deduction
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient wallet balance' });

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Full Sangam bet placed: ${openPana}-${closePana}`
    });
    await wallet.save();

    // 🔸 Save Entry
    const entry = new FullSangam({
      openPana,
      closePana,
      amount,
      gameType,
      gameDate,
      user: userId,
      openingTime: openingTime || null,
      closingTime: closingTime || null,
    });

    await entry.save();
    const populatedEntry = await FullSangam.findById(entry._id).populate('user', 'name email');

    res.status(201).json({
      message: 'Full Sangam entry created and wallet updated',
      walletBalance: wallet.balance,
      data: {
        id: populatedEntry._id,
        openPana: populatedEntry.openPana,
        closePana: populatedEntry.closePana,
        amount: populatedEntry.amount,
        gameType: populatedEntry.gameType,
        gameDate: populatedEntry.gameDate,
        openingTime: populatedEntry.openingTime,
        closingTime: populatedEntry.closingTime,
        createdAt: populatedEntry.createdAt,
        user: {
          id: populatedEntry.user._id,
          name: populatedEntry.user.name,
          email: populatedEntry.user.email
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Full Sangam Entries
exports.getAllFullSangam = async (req, res) => {
  try {
    const entries = await FullSangam.find().populate('user', 'name email');
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Entries by User ID
exports.getFullSangamByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await FullSangam.find({ user: userId }).sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Entry
exports.deleteFullSangam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FullSangam.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Entry
exports.updateFullSangam = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FullSangam.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
