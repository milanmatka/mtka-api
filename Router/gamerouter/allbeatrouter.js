const express = require('express');
const router = express.Router();

const { getAllMyBets } = require('../../Controller/gamecontroller/allbeatcontroller'); // ✅ FIXED
const { protect } = require('../../middleware/authMiddleware');

// GET My All Bets
router.get('/my-bets', protect, getAllMyBets); // ✅ FIXED

module.exports = router;
