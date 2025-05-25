const express = require("express");
const { placeBet  , getStarlineBetStatus , getAllUsersStarlineBetDetailedHistory } = require("../../Controller/starlineGameController/starlineBetController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/place", protect, placeBet);

router.get("/starline/bet-status", protect, getStarlineBetStatus);

router.get("/all-bets", getAllUsersStarlineBetDetailedHistory);

module.exports = router;
