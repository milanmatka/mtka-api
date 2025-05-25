const TriplePana = require('../../modal/gamemodal/TriplePanamodal');
const Wallet = require('../../modal/walletmodal/walletmodal');
const GameTime = require('../../modal/Adminmodal/gametimemodal');

const subtractMinutes = (date, minutes) => new Date(date.getTime() - minutes * 60000);

const isTriplePana = (num) => /^[0-9]{3}$/.test(num) && num[0] === num[1] && num[1] === num[2];

exports.addTriplePana = async (req, res) => {
  try {
    const { panaNumber, amount, gameType,gameDate,betType} = req.body;
    const userId = req.user._id;

    if (!gameType) return res.status(400).json({ message: "Game type is required" });

   

    if (!isTriplePana(panaNumber)) {
      return res.status(400).json({
        message: "Invalid Triple Pana number. Must be 3 same digits (e.g., 000–999)."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

 


   

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: "debit",
      note: `Triple Pana bet placed on ${panaNumber}`
    });
    await wallet.save();

    const newPana = new TriplePana({
      panaNumber,
      amount,
      gameType,
      gameDate,
      betType,
      user: userId,
    });

    await newPana.save();
    await newPana.populate("user", "name email");

    res.status(201).json({
      message: 'Triple Pana placed and balance deducted',
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


exports.getAllTriplePanas = async (req, res) => {
  try {
    const triplePanas = await TriplePana.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched successfully", count: triplePanas.length, data: triplePanas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTriplePanasByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const panas = await TriplePana.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "User entries fetched", count: panas.length, data: panas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTriplePana = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TriplePana.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTriplePana = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPana = await TriplePana.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedPana) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Updated successfully", data: updatedPana });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get All Triple Pana Entries
exports.getAllTriplePanas = async (req, res) => {
  try {
    const triplePanas = await TriplePana.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Triple Pana entries fetched successfully',
      count: triplePanas.length,
      data: triplePanas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Triple Panas by User ID
exports.getTriplePanasByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const panas = await TriplePana.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Triple Pana entries fetched for user',
      count: panas.length,
      data: panas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Triple Pana by ID
exports.deleteTriplePana = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TriplePana.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Triple Pana not found' });
    }

    res.status(200).json({ message: 'Triple Pana deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Triple Pana by ID
exports.updateTriplePana = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPana = await TriplePana.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPana) {
      return res.status(404).json({ message: 'Triple Pana not found' });
    }

    res.status(200).json({
      message: 'Triple Pana updated successfully',
      data: updatedPana,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
