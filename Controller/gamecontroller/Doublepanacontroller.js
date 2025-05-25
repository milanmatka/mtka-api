const DoublePana = require('../../modal/gamemodal/Doublepanamodal');
const Wallet = require('../../modal/walletmodal/walletmodal');

// 🔹 Add Double Pana (Requires user from token)
exports.addDoublePana = async (req, res) => {
  try {
    const { panaNumber, amount, gameType,gameDate,betType} = req.body;
    const userId = req.user._id;

    // Game type validation
    if (!gameType) {
      return res.status(400).json({ message: "Game type is required" });
    }

   
    // Format validation: only allow AAB or ABB (not ABA or AAA)
    if (!/^\d{3}$/.test(panaNumber)) {
      return res.status(400).json({ message: "Pana must be a 3-digit number" });
    }
    const [a, b, c] = panaNumber.split('');
    const isValidDoublePana = (a === b && b !== c) || (b === c && a !== b);
    if (!isValidDoublePana) {
      return res.status(400).json({ message: "Double Pana must be in AAB or ABB format (e.g., 112 or 221)" });
    }

    // Wallet check and deduction
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient wallet balance' });

    // Deduct from wallet
    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Double Pana bet placed on ${panaNumber}`
    });
    await wallet.save();

    const newPana = new DoublePana({
      panaNumber,
      amount,
      gameType,
      gameDate,
      betType,
      user: userId,
    });

    await newPana.save();
    await newPana.populate('user', 'name email');

    res.status(201).json({
      message: 'Double Pana placed and balance deducted',
      walletBalance: wallet.balance,
      data: {
        id: newPana._id,
        panaNumber: newPana.panaNumber,
        amount: newPana.amount,
        gameType: newPana.gameType,
        gameDate: newPana.gameDate,
        betType: newPana.betType,
        createdAt: newPana.createdAt,
        user: {
          id: newPana.user._id,
          name: newPana.user.name,
          email: newPana.user.email,
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Double Panas (Admin purpose)
exports.getAllDoublePanas = async (req, res) => {
  try {
    const panas = await DoublePana.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(panas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Double Panas by Logged-in User
exports.getDoublePanasByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const panas = await DoublePana.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Fetched successfully',
      count: panas.length,
      data: panas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Double Pana by ID
exports.updateDoublePana = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DoublePana.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    if (!updated) return res.status(404).json({ message: 'Pana not found' });

    res.status(200).json({
      message: 'Double Pana updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Double Pana by ID
exports.deleteDoublePana = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DoublePana.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Pana not found' });

    res.status(200).json({ message: 'Double Pana deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
