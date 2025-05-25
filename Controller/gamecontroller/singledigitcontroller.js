const SingleDigit = require('../../modal/gamemodal/Singlemodal');
const Wallet = require('../../modal/walletmodal/walletmodal');
const User = require('../../modal/Usermodal');

// POST: Place a single digit bet
// POST: Place a single digit bet

exports.placeSingleDigit = async (req, res) => {
  const { digit, amount, isOpenClosed, openingTime, closingTime, gameType } = req.body;
  const userId = req.user.id;

  try {
    if (!gameType && !isOpenClosed) {
      return res.status(400).json({ message: "Game type is required" });
    }

    if (digit < 0 || digit > 9) {
      return res.status(400).json({ message: "Digit must be between 0 and 9" });
    }

    if ((openingTime && closingTime) || (!openingTime && !closingTime)) {
      return res.status(400).json({
        message: "Please provide either openingTime or closingTime (not both or none)"
      });
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance in wallet" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Bet on ${gameType} digit ${digit}`
    });
    await wallet.save();

    const entry = new SingleDigit({
      digit,
      amount,
      user: userId,
      gameType,
      isOpenClosed,
      openingTime: openingTime || null,
      closingTime: closingTime || null
    });

    await entry.save();
    await entry.populate('user', 'name');

    res.status(201).json({
      message: "Bet placed successfully",
      walletBalance: wallet.balance,
      entry: {
        id: entry._id,
        digit: entry.digit,
        amount: entry.amount,
        isOpenClosed: entry.isOpenClosed,
        gameType: entry.gameType,
        openingTime: entry.openingTime,
        closingTime: entry.closingTime,
        createdAt: entry.createdAt,
        user: {
          id: entry.user._id,
          name: entry.user.name
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  

// GET: Fetch all bets placed by the logged-in user
exports.getSingleDigitBets = async (req, res) => {
  const userId = req.user.id;

  try {
    const bets = await SingleDigit.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Bets fetched successfully",
      count: bets.length,
      bets: bets.map(bet => ({
        id: bet._id,
        digit: bet.digit,
        amount: bet.amount,
        openingTime: bet.openingTime,
        closingTime: bet.closingTime,
        createdAt: bet.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
