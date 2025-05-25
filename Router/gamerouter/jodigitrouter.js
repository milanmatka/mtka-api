const express = require('express');
const router = express.Router();
const { placeJodi, getJodiBets } = require('../../Controller/gamecontroller/jodigitcontrolller');
const { protect } = require('../../middleware/authMiddleware');

// Place Jodi bet
router.post('/place', protect, placeJodi);

// Get all user's Jodi bets
router.get('/mybets', protect, getJodiBets);

module.exports = router;
