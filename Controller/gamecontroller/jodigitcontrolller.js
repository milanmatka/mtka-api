const Jodi = require('../../modal/gamemodal/jodigitmodal');
const Wallet = require('../../modal/walletmodal/walletmodal');

// POST: Place a Jodi bet
exports.placeJodi = async (req, res) => {
  const { jodiNumber, amount, gameType } = req.body;
  const userId = req.user.id;

  try {
    // Convert number to 2-digit string
    const formattedJodi = parseInt(jodiNumber, 10).toString().padStart(2, '0');

    if (parseInt(formattedJodi) < 0 || parseInt(formattedJodi) > 99) {
      return res.status(400).json({ message: "Jodi number must be between 00 and 99" });
    }

    if (!gameType) {
      return res.status(400).json({ message: "Game type is required" });
    }

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        balance: 0,
        transactions: []
      });

      return res.status(400).json({ message: "Wallet was not found and has been created. Please add balance to place a bet." });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      note: `Jodi bet placed on number ${formattedJodi}`
    });
    await wallet.save();

    const jodiEntry = new Jodi({
      jodiNumber: formattedJodi,
      amount,
      gameType,
      user: userId
    });

    await jodiEntry.save();
    await jodiEntry.populate('user', 'name');

    res.status(201).json({
      message: "Jodi bet placed and balance deducted",
      walletBalance: wallet.balance,
      entry: {
        id: jodiEntry._id,
        jodiNumber: jodiEntry.jodiNumber,
        amount: jodiEntry.amount,
        gameType: jodiEntry.gameType,
        createdAt: jodiEntry.createdAt,
        user: {
          id: jodiEntry.user._id,
          name: jodiEntry.user.name
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET: Fetch all Jodi bets of the logged-in user
exports.getJodiBets = async (req, res) => {
  const userId = req.user.id;
  const { gameType } = req.query;

  try {
    const filter = { user: userId };
    if (gameType) filter.gameType = gameType;

    const bets = await Jodi.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Jodi bets fetched successfully",
      count: bets.length,
      bets: bets.map(bet => ({
        id: bet._id,
        jodiNumber: bet.jodiNumber,
        amount: bet.amount,
        gameType: bet.gameType,
        openingTime: bet.openingTime,
        closingTime: bet.closingTime,
        createdAt: bet.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
