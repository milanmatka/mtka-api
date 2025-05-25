const StarlineResult = require("../../modal/starlineGamemodal/StarlineResultmodal");
const StarlineBet = require("../../modal/starlineGamemodal/starlinebetmodal");
const Wallet = require("../../modal/walletmodal/walletmodal");
const StarlineGame = require("../../modal/starlineGamemodal/starlineGamemodal");

const getSumLastDigit = (digits) => {
  const sum = digits.split("").reduce((acc, digit) => acc + parseInt(digit), 0);
  return String(sum % 10);
};

const uploadResult = async (req, res) => {
  try {
    const { gameId, openDigits, closeDigits } = req.body;

    // Validate game ID
    const game = await StarlineGame.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found"
      });
    }

    // Validate game status
    if (!game.isActive) {
      return res.status(400).json({
        success: false,
        message: "Game is not active"
      });
    }

    // Calculate results
    const openResult = getSumLastDigit(openDigits);
    const closeResult = getSumLastDigit(closeDigits);
    const jodiResult = openResult + closeResult;

    // Create result document
    const result = new StarlineResult({
      gameId,
      openDigits,
      closeDigits,
      openResult,
      closeResult,
      jodiResult,
    });

    await result.save();

    // Fetch all pending bets for this game
    const bets = await StarlineBet.find({ gameId, status: "pending" })
      .populate("userId", "name email")
      .populate("gameId", "name closeTime");

    // Fetch previous results for this game
    const previousResults = await StarlineResult.find({ gameId })
      .sort({ createdAt: -1 })
      .limit(1);

    const latestResult = previousResults[0];

    for (const bet of bets) {
      let isWinner = false;
      let multiplier = 2; // Default multiplier

      // Determine which result to compare based on betType
      const resultToCompare = bet.betType === 'open' ? openResult : closeResult;
      const digitsToCompare = bet.betType === 'open' ? openDigits : closeDigits;

      // Update bet details with actual result
      bet.betDetails = `Digit: ${resultToCompare}`;
      bet.openResult = openResult;
      bet.closeResult = closeResult;
      bet.jodiResult = jodiResult;
      bet.resultId = result._id;

      // // Log bet details for debugging
      // console.log(`Evaluating bet ${bet._id}:
      //   Game ID: ${gameId}
      //   Game Type: ${bet.gameType}
      //   Bet Type: ${bet.betType}
      //   Bet Number: ${ bet.singleDigit ||bet.betNumber  || bet.panaNumber}
      //   Open Digits: ${openDigits}
      //   Close Digits: ${closeDigits}
      //   Open Result: ${openResult}
      //   Close Result: ${closeResult}
      //   Jodi Result: ${jodiResult}`);

      // // Log bet details for debugging
      // console.log(`Evaluating bet ${bet._id}:
      //   Game Type: ${bet.gameType}
      //   Bet Type: ${bet.betType}
      //   Bet Number: ${bet.betNumber || bet.singleDigit || bet.panaNumber}
      //   Open Result: ${openResult}
      //   Close Result: ${closeResult}
      //   Jodi Result: ${jodiResult}`);

      switch (bet.gameType.toLowerCase()) {
        case "single":
          if (bet.betType === 'open') {
            if (String(bet.singleDigit) === String(openResult)) {
              isWinner = true;
              multiplier = 9;
            }
          } else if (bet.betType === 'close') {
            if (String(bet.singleDigit) === String(closeResult)) {
              isWinner = true;
              multiplier = 9;
            }
          }
          break;


        case "jodi":
          // For jodi bets
          if (bet.betNumber === jodiResult) {
            isWinner = true;
            multiplier = 90;
          }
          break;

        case "singlepana":
          // For single pana bets
          if (bet.betType === 'open') {
            if (bet.panaNumber === openDigits) {
              isWinner = true;
              multiplier = 140;
            }
          } else if (bet.betType === 'close') {
            if (bet.panaNumber === closeDigits) {
              isWinner = true;
              multiplier = 140;
            }
          }
          break;

        case "doublepana":
          // For double pana bets
          if (bet.betType === 'open') {
            if (bet.panaNumber === openDigits) {
              isWinner = true;
              multiplier = 300;
            }
          } else if (bet.betType === 'close') {
            if (bet.panaNumber === closeDigits) {
              isWinner = true;
              multiplier = 300;
            }
          }
          break;

        case "triplepana":
          // For triple pana bets
          if (bet.betType === 'open') {
            if (bet.panaNumber === openDigits) {
              isWinner = true;
              multiplier = 500;
            }
          } else if (bet.betType === 'close') {
            if (bet.panaNumber === closeDigits) {
              isWinner = true;
              multiplier = 500;
            }
          }
          break;

        case "half sangam":
          // For half sangam bets
          if (bet.betType === 'open') {
            if (bet.openPana === openDigits && bet.closeDigit === closeResult) {
              isWinner = true;
              multiplier = 400;
            }
          } else if (bet.betType === 'close') {
            if (bet.openPana === closeDigits && bet.closeDigit === openResult) {
              isWinner = true;
              multiplier = 400;
            }
          }
          break;

        case "full sangam":
          // For full sangam bets
          if (bet.betType === 'open') {
            if (bet.openPana === openDigits && bet.closePana === closeDigits) {
              isWinner = true;
              multiplier = 800;
            }
          } else if (bet.betType === 'close') {
            if (bet.openPana === closeDigits && bet.closePana === openDigits) {
              isWinner = true;
              multiplier = 800;
            }
          }
          break;
      }

      if (isWinner) {
        bet.status = "won";
        bet.winningAmount = bet.amount * multiplier;
      } else {
        bet.status = "lost";
      }

      await bet.save();
    }

    res.status(200).json({
      success: true,
      message: "Result uploaded and bets evaluated",
      data: result,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all results according to game id
const getAllResults = async (req, res) => {
  try {
    // Fetch all results for the specified game
    const results = await StarlineResult.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: results,
    });

  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { uploadResult, getAllResults };
