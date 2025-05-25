const express = require("express");
const router = express.Router();
const {
  createGameResult,
  getAllResults,
  getResultByDate,
} = require("../../../Controller/Admincontroller/resultcontroller/resultgamecontroller");

router.post("/create", createGameResult);           // POST /api/game-result
router.get("/getAllResults", getAllResults);               // GET /api/game-result
router.get("/getAllResults:date", getResultByDate);        // GET /api/game-result/2025-04-10

module.exports = router;
