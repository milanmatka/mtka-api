const GameTime = require('../../modal/Adminmodal/gametimemodal');
const SinglePana = require('../../modal/gamemodal/singlepanamodal');
const Wallet = require('../../modal/walletmodal/walletmodal');



// Add a Single Pana Bet
exports.addSinglePana = async (req, res) => {
  try {
    const { panaNumber, amount, gameType,  betType, gameDate } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!panaNumber || !amount || !gameType || !betType || !gameDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!['open', 'close'].includes(betType)) {
      return res.status(400).json({ message: "Invalid bet type. Use 'open' or 'close'." });
    }

    // // Convert gameDate to start of day UTC
    // const gameDateObj = new Date();
    // gameDateObj.setUTCHours(0, 0, 0, 0);
    // console.log("Normalized game date:", gameDateObj); // Debugging the date

    // Get game time for that date
    // const gameTime = await GameTime.findOne({ gameType, date: gameDateObj });
    // if (!gameTime) {
    //   return res.status(404).json({ message: "Game time not set for the selected date" });
    // }


  

    // Wallet check
    const wallet = await Wallet.findOne({ user: userId });
    console.log("User wallet:", wallet); // Debugging the wallet
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient wallet balance' });

    // Deduct balance and log transaction
    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Single Pana bet placed on ${panaNumber} (${betType})`
    });
    await wallet.save();

    // Save the bet
    const newPana = new SinglePana({
      panaNumber,
      amount,
      gameType,
      gameDate,
      betType,
      // betTime,
      user: userId,
    });

    await newPana.save();
    await newPana.populate('user', 'name email');

    res.status(201).json({
      message: 'Single Pana placed and balance deducted',
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



// Get all Single Panas (admin)
exports.getAllSinglePanas = async (req, res) => {
  try {
    const panas = await SinglePana.find().populate('user', 'name email');
    res.status(200).json(panas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Panas by User ID
exports.getSinglePanasByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const panas = await SinglePana.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(panas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Single Pana by ID
exports.deleteSinglePana = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SinglePana.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Pana not found' });
    res.status(200).json({ message: 'Single Pana deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Single Pana
exports.updateSinglePana = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPana = await SinglePana.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPana) return res.status(404).json({ message: 'Pana not found' });

    res.status(200).json({ message: 'Single Pana updated', data: updatedPana });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
