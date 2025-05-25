const StarlineGame = require("../../modal/starlineGamemodal/starlineGamemodal");
const StarlineResult = require("../../modal/starlineGamemodal/StarlineResultmodal");

// Create a new game with today's date
const createGame = async (req, res) => {
  try {
    const { gameName, openTime, closeTime } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time

    const game = new StarlineGame({
      gameName,
      openTime,
      closeTime,
      gameDate: today,
      isActive: true
    });

    await game.save();

    res.status(201).json({ success: true, message: "Game created", data: game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active games with results
const getActiveGames = async (req, res) => {
  try {
    const games = await StarlineGame.find({ isActive: true });

    const gamesWithResult = await Promise.all(
      games.map(async (game) => {
        const result = await StarlineResult.findOne({ gameId: game._id }).sort({ createdAt: -1 });

        return {
          ...game.toObject(),
          result: result ? {
            openDigits: result.openDigits,
            closeDigits: result.closeDigits,
            openResult: result.openResult,
            closeResult: result.closeResult,
            jodiResult: result.jodiResult
          } : null
        };
      })
    );

    res.status(200).json({ success: true, data: gamesWithResult });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all games (admin view)
const getGames = async (req, res) => {
  try {
    const games = await StarlineGame.find();
    res.status(200).json({ success: true, data: games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reset today's games for the next day (clone games for tomorrow)
const resetGamesForNextDay = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayGames = await StarlineGame.find({
      gameDate: { $gte: today, $lt: tomorrow },
      isActive: true
    });

    const newGames = todayGames.map(game => {
      const newGame = game.toObject();
      delete newGame._id;
      newGame.gameDate = tomorrow;
      return newGame;
    });

    await StarlineGame.insertMany(newGames);

    res.status(200).json({ success: true, message: 'Games reset for the next day successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a starline game by ID
const deleteGameById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Game ID is required" });
    }

    const deletedGame = await StarlineGame.findByIdAndDelete(id);
    if (!deletedGame) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.status(200).json({ success: true, message: "Game deleted successfully", data: deletedGame });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createGame,
  getActiveGames,
  getGames,
  resetGamesForNextDay,
  deleteGameById
};
