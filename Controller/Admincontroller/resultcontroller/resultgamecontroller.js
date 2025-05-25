const GameResult = require("../../../modal/Adminmodal/Result/resultgamemodal");
const StarlineResult = require("../../../modal/starlineGamemodal/StarlineResultmodal");
// @desc    Create a new game result
// @route   POST /api/game-result
exports.createGameResult = async (req, res) => {
  try {
    const { gameName, date, openDigits, closeDigits } = req.body;

    if (!gameName || !date || !openDigits || !closeDigits) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(openDigits.length !== 3 || closeDigits.length !== 3) {
      return res.status(400).json({ message: "Open and Close digits must be 3 digits each" });
    }
    const result = new GameResult({
      gameName,
      date,
      openDigits,
      closeDigits,
    });

    await result.save();

    res.status(201).json({
      message: "Game result saved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all game results
// @route   GET /api/game-result
exports.getAllResults = async (req, res) => {
  try {
    const results = await StarlineResult.find().sort({ date: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};

// @desc    Get result by date
// @route   GET /api/game-result/:date
exports.getResultByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const results = await GameResult.find({ date });

    if (results.length === 0) {
      return res.status(404).json({ message: "No result found for this date" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching result", error: error.message });
  }
};
