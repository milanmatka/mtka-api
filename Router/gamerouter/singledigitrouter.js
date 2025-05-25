const express = require('express');
const router = express.Router();
const { placeSingleDigit, getSingleDigitBets } = require('../../Controller/gamecontroller/singledigitcontroller');
const { protect } = require('../../middleware/authMiddleware');

router.post('/place', protect, placeSingleDigit);
router.get('/mybets', protect, getSingleDigitBets);

module.exports = router;
