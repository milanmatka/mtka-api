const express = require('express');
const router = express.Router();

const { placeBet, uploadResult, addGame, getAllWinners, getAllGames, deleteGame,getAllBets, getAllResults } = require('../../Controller/GalidesawarBetcontroller/GalidesawarBetcontoller');
const { protect, adminProtect } = require('../../middleware/authMiddleware'); // ✅ Correct import

// 🎯 Betting routes
router.post("/place-bet", protect, placeBet);
router.put('/set-result/:gameId', uploadResult);

// ➕ Add game route (no token required)
router.post('/add-game', addGame);

// Get all winners (no token required)
router.get("/all-winners", getAllWinners);

// Get all games (no token required)
router.get("/all-games", getAllGames);
router.get("/all-bets", getAllBets);
router.get("/all-results", getAllResults);


// Delete game by ID (no token required)
router.delete('/:id', deleteGame);


module.exports = router;
