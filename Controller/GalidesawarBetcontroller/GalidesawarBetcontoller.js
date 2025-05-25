const GalidesawarGame = require('../../modal/GalidesawarGamemodal/GalidesawarGamemodal');
const GalidesawarBet = require('../../modal/GalidesawarGamemodal/GalidesawarBetmodal');
const Wallet = require('../../modal/walletmodal/walletmodal');
const moment = require('moment');

// ✅ Place Bet
const placeBet = async (req, res) => {
    const { gameId, betType, number, amount } = req.body;
    const userId = req.user._id;
  
    try {
      const game = await GalidesawarGame.findById(gameId);
      if (!game) return res.status(404).json({ message: 'Game not found' });
  
      if (game.result && game.result.left && game.result.right) {
        return res.status(400).json({ message: 'Betting closed - result already declared' });
      }
  
      // ✅ Corrected wallet fetching
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  
      const now = moment();
      const [hour, minute] = game.closeTime.split(':').map(Number);
      const gameClose = moment().set({ hour, minute, second: 0 });
  
      if (now.isAfter(gameClose)) {
        return res.status(400).json({ message: 'Betting closed for this game' });
      }
  
      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // ✅ Deduct balance and log transaction (optional)
      wallet.balance -= amount;
      wallet.transactions.push({
        amount,
        type: 'debit',
        note: `Galidesawar bet on ${number} (${betType})`
      });
      await wallet.save();
  
      const bet = new GalidesawarBet({
        userId,
        gameId,
        betType,
        number,
        amount
      });
  
      await bet.save();
      res.status(200).json({ message: 'Bet placed successfully', bet });
  
    } catch (error) {
      console.error('Place Bet Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// ✅ Declare Result
const uploadResult = async (req, res) => {
    const { gameId } = req.params;
    const { left, right } = req.body;
  
    try {
      if (!left || !right) {
        return res.status(400).json({ message: "Left and Right numbers are required" });
      }
  
      const jodi = `${left}${right}`;
  
      const game = await GalidesawarGame.findById(gameId);
      if (!game) return res.status(404).json({ message: 'Game not found' });
  
      if (game.result.left && game.result.right) {
        return res.status(400).json({ message: 'Result already declared' });
      }
  
      // ✅ Set the result
      game.result = { left, right, jodi };
      await game.save();
  
      // ✅ Find and reward winners
      const bets = await GalidesawarBet.find({ gameId });
      const winners = [];
  
      for (let bet of bets) {
        let isWinner = false;
  
        if (bet.betType === 'left' && bet.number === left) isWinner = true;
        if (bet.betType === 'right' && bet.number === right) isWinner = true;
        if (bet.betType === 'jodi' && bet.number === jodi) isWinner = true;
  
        if (isWinner) {
          bet.isWinner = true;
          await bet.save();
  
          const wallet = await Wallet.findOne({ user: bet.userId });
          if (wallet) {
            const winAmount = bet.amount * 10; // ⬅️ You can customize multiplier
            wallet.balance += winAmount;
            wallet.transactions.push({
              amount: winAmount,
              type: 'credit',
              note: `Winning on ${bet.betType} bet - ${bet.number}`
            });
            await wallet.save();
          }
  
          winners.push(bet.userId);
        }
      }
  
      res.status(200).json({
        message: 'Result uploaded successfully',
        result: { left, right, jodi },
        winners
      });
  
    } catch (error) {
      console.error('Upload Result Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// ➕ Add new game (No token required)
const addGame = async (req, res) => {
  const { gameName, closeTime } = req.body;

  try {
    if (!gameName || !closeTime) {
      return res.status(400).json({ message: 'gameName and closeTime are required' });
    }

    const newGame = new GalidesawarGame({
      gameName,
      closeTime
    });

    await newGame.save();

    res.status(201).json({ message: 'Game created successfully', game: newGame });
  } catch (error) {
    console.error('Add Game Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllWinners = async (req, res) => {
  try {
    const winnerBets = await GalidesawarBet.find({ isWinner: true })
      .populate('userId', 'name number')
      .populate('gameId', 'gameName closeTime result')
      .sort({ _id: -1 });

    const formattedWinners = winnerBets.map(bet => ({
      userId: bet.userId?._id || null,
      userName: bet.userId?.name || '',
      userNumber: bet.userId?.number || '',
      gameId: bet.gameId?._id || null,
      gameName: bet.gameId?.gameName || '',
      result: bet.gameId?.result || {},
      closeTime: bet.gameId?.closeTime || '',
      betType: bet.betType,
      number: bet.number,
      amount: bet.amount,
      winningAmount: bet.amount * 10,
    }));

    res.status(200).json({ winners: formattedWinners });
  } catch (error) {
    console.error("Get Winners Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// show all games
const getAllGames = async (req, res) => {
    try {
      const games = await GalidesawarGame.find().sort({ _id: -1 });
      res.status(200).json({ games });
    }
    catch (error) {
      console.error("Get All Games Error:", error);
      res.status(500).json({ message: "Server error" });  
    }
}

const getAllBets = async (req, res) => {
  try {
    const games = await GalidesawarBet.find({})
      .populate('userId', 'name number')
      .populate('gameId', 'gameName closeTime result')
      .sort({ _id: -1 });

    const formattedData = games.map(bet => ({
      userId: bet.userId?._id || null,
      userName: bet.userId?.name || '',
      userNumber: bet.userId?.number || '',
      gameId: bet.gameId?._id || null,
      gameName: bet.gameId?.gameName || '',
      result: bet.gameId?.result || {},
      closeTime: bet.gameId?.closeTime || '',
      betType: bet.betType,
      number: bet.number,
      amount: bet.amount,
      status: bet.isWinner ? bet.amount * 10 : 'lose'
    }));

    res.status(200).json({ allBets: formattedData });
  } catch (error) {
    console.error("Get All Games Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete game by ID
const deleteGame = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: 'Game ID is required' });
      }

      const deletedGame = await GalidesawarGame.findByIdAndDelete(id);
      
      if (!deletedGame) {
        return res.status(404).json({ message: 'Game not found' });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Game deleted successfully',
        deletedGame 
      });
    } catch (error) {
      console.error('Delete Game Error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid game ID format' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

// ✅ Get all declared results for dashboard
const getAllResults = async (req, res) => {
  try {
    // Find all games where result is declared (left and right exist)
    const games = await GalidesawarGame.find({
      "result.left": { $exists: true, $ne: null },
      "result.right": { $exists: true, $ne: null }
    })
      .sort({ _id: -1 });

    // Format for dashboard
    const formattedResults = games.map(game => ({
      gameId: game._id,
      gameName: game.gameName,
      closeTime: game.closeTime,
      result: game.result, // { left, right, jodi }
      declaredAt: game.updatedAt || game.createdAt
    }));

    res.status(200).json({ results: formattedResults });
  } catch (error) {
    console.error("Get All Results Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  placeBet,
  uploadResult,
  addGame,  // This is the token-less version
  getAllWinners,
  getAllGames,
  deleteGame,
  getAllBets,
  getAllResults // <-- add here
};
