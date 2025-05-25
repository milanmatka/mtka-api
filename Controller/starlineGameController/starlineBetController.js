const moment = require('moment-timezone');
const StarlineBet = require("../../modal/starlineGamemodal/starlinebetmodal");
const StarlineGame = require("../../modal/starlineGamemodal/starlineGamemodal");
const Wallet = require("../../modal/walletmodal/walletmodal");
const StarlineResult = require("../../modal/starlineGamemodal/StarlineResultmodal");
const User = require("../../modal/Usermodal");

const isDoublePana = (val) => {
  const [a, b, c] = val;
  return (a === b && b !== c) || (b === c && a !== b);
};

const isTriplePana = (val) => {
  return val[0] === val[1] && val[1] === val[2];
};

const getSumLastDigit = (digits) => {
  const sum = digits.split("").reduce((acc, digit) => acc + parseInt(digit), 0);
  return String(sum % 10);
};

// ✅ Place Bet
const placeBet = async (req, res) => {
  try {
    const { gameId, gameType, betNumber, amount, panaNumber, openPana, closePana, closeDigit, betType } = req.body;
    const userId = req.user._id;

    if (!betType || !['open', 'close'].includes(betType)) {
      return res.status(400).json({ message: "Invalid betType. Must be either 'open' or 'close'" });
    }

    const game = await StarlineGame.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance or wallet not found" });
    }

    const now = moment().tz("Asia/Kolkata");
    const [openHour, openMinute] = game.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = game.closeTime.split(":").map(Number);
    
    // Create time objects for today's game
    const openTime = moment(game.gameDate).set({ hour: openHour, minute: openMinute });
    const closeTime = moment(game.gameDate).set({ hour: closeHour, minute: closeMinute });
    const openCutoffTime = openTime.add(15, 'minutes');
    const closeCutoffTime = closeTime.subtract(15, 'minutes');

    // Validate bet timing based on betType
    if (betType === 'open') {
      if (now.isAfter(openCutoffTime)) {
        return res.status(400).json({ 
          message: "Open bets are closed. Please place close bets instead."
        });
      }
    } else if (betType === 'close') {
      if (now.isAfter(closeCutoffTime)) {
        return res.status(400).json({ 
          message: "Close bets are closed."
        });
      }
    } else {
      return res.status(400).json({ 
        message: "Invalid bet type. Must be either 'open' or 'close'"
      });
    }

    // Check if game is active
    if (!game.isActive) {
      return res.status(400).json({ 
        message: "Game is not active"
      });
    }

    // Check if today's game time has passed
    if (now.isAfter(closeTime)) {
      return res.status(400).json({ 
        message: "Game time has passed"
      });
    }

    // Check if game is still active
    if (!game.isActive) {
      return res.status(400).json({ 
        message: "Game is not active"
      });
    }

    // Check if game has already been closed
    if (game.status === 'closed') {
      return res.status(400).json({ 
        message: "Game has been closed"
      });
    }

    // Check if result has already been declared
    const result = await StarlineResult.findOne({ gameId });
    if (result) {
      return res.status(400).json({ 
        message: "Result has already been declared for this game"
      });
    }

    // Check if user already has pending bets for this game
    // const existingBet = await StarlineBet.findOne({
    //   userId,
    //   gameId,
    //   betType,
    //   status: 'pending'
    // });
    // if (existingBet) {
    //   return res.status(400).json({ 
    //     message: "You already have a pending bet for this game type"
    //   });
    // }

    // Check if bet number is valid
    if (gameType === 'single') {
      if (!betNumber || betNumber.length !== 1 || isNaN(betNumber)) {
        return res.status(400).json({ 
          message: "Invalid single digit bet number"
        });
      }
    } else if (gameType === 'jodi') {
      if (!betNumber || betNumber.length !== 2 || isNaN(betNumber)) {
        return res.status(400).json({ 
          message: "Invalid jodi bet number"
        });
      }
    } else if (gameType === 'single pana') {
      if (!panaNumber || panaNumber.length !== 3 || isNaN(panaNumber)) {
        return res.status(400).json({ 
          message: "Invalid single pana bet number"
        });
      }
    } else if (gameType === 'double pana') {
      if (!panaNumber || panaNumber.length !== 3 || isNaN(panaNumber)) {
        return res.status(400).json({ 
          message: "Invalid double pana bet number"
        });
      }
    }

    // Check if open time has passed for open bets
    if (betType === 'open' && now.isAfter(openTime)) {
      return res.status(400).json({ 
        message: "Open betting time has passed for today's game. Please wait for tomorrow's game."
      });
    }

    // Check if close time has passed for close bets
    if (betType === 'close' && now.isAfter(closeCutoffTime)) {
      return res.status(400).json({ 
        message: "Close betting time has passed for today's game. Please wait for tomorrow's game."
      });
    }

    let betData = { userId, gameId, gameType, amount, betType };

    switch (gameType.toLowerCase()) {
      case "single":
        if (!/^[0-9]$/.test(betNumber)) return res.status(400).json({ message: "Single bet must be a digit (0-9)" });
        betData.singleDigit = parseInt(betNumber);
        break;
      case "jodi":
        if (!/^[0-9]{2}$/.test(betNumber)) return res.status(400).json({ message: "Jodi must be 2-digit" });
        betData.betNumber = betNumber;
        break;
      case "singlepana":
        if (!/^[0-9]{3}$/.test(panaNumber) || isDoublePana(panaNumber) || isTriplePana(panaNumber)) {
          return res.status(400).json({ message: "Invalid Single Pana" });
        }
        betData.panaNumber = panaNumber;
        break;
      case "doublepana":
        if (!/^[0-9]{3}$/.test(panaNumber) || !isDoublePana(panaNumber)) {
          return res.status(400).json({ message: "Invalid Double Pana" });
        }
        betData.panaNumber = panaNumber;
        break;
      case "triplepana":
        if (!/^[0-9]{3}$/.test(panaNumber) || !isTriplePana(panaNumber)) {
          return res.status(400).json({ message: "Invalid Triple Pana" });
        }
        betData.panaNumber = panaNumber;
        break;
      case "half sangam":
        if (!/^[0-9]{3}$/.test(openPana) || !/^[0-9]$/.test(closeDigit)) {
          return res.status(400).json({ message: "Invalid Half Sangam" });
        }
        betData.openPana = openPana;
        betData.closeDigit = closeDigit;
        break;
      case "full sangam":
        if (!/^[0-9]{3}$/.test(openPana) || !/^[0-9]{3}$/.test(closePana)) {
          return res.status(400).json({ message: "Invalid Full Sangam" });
        }
        betData.openPana = openPana;
        betData.closePana = closePana;
        break;
      default:
        return res.status(400).json({ message: "Invalid game type" });
    }

    // Create the bet
    const bet = new StarlineBet(betData);
    await bet.save();

    // Update wallet balance
    await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: -amount } }
    );

    res.status(201).json({ success: true, message: "Bet placed", data: bet });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message, 
      error: err.message 
    });
  }
};
const getStarlineBetStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const bets = await StarlineBet.find({ userId });

    for (let bet of bets) {
      if (bet.status !== "pending") continue;

      const game = await StarlineGame.findById(bet.gameId);
      if (!game) continue;

      const result = await StarlineResult.findOne({ gameId: bet.gameId });
      if (!result) continue;

      let isWinner = false;
      let multiplier = 2;

      const resultToCompare = bet.betType === 'open' ? result.openResult : result.closeResult;
      const digitsToCompare = bet.betType === 'open' ? result.openDigits : result.closeDigits;

      switch (bet.gameType) {
        case "single":
          if (bet.singleDigit === parseInt(resultToCompare)) {
            isWinner = true;
            multiplier = 9;
          }
          break;

        case "jodi":
          if (bet.betNumber === result.jodiResult) {
            isWinner = true;
            multiplier = 90;
          }
          break;

        case "single pana":
          if (bet.panaNumber === digitsToCompare) {
            isWinner = true;
            multiplier = 140;
          }
          break;

        case "double pana":
          if (bet.panaNumber === digitsToCompare) {
            isWinner = true;
            multiplier = 300;
          }
          break;
      }

      if (isWinner) {
        try {
          await Wallet.findOneAndUpdate(
            { user: userId },
            { $inc: { balance: bet.amount * multiplier } }
          );
          bet.status = "won";
          bet.winningAmount = bet.amount * multiplier;
        } catch (err) {
          console.error(err);
          res.status(500).json({ 
            success: false, 
            message: "Error updating wallet balance", 
            error: err.message 
          });
        }
      } else {
        bet.status = "lost";
      }

      try {
        await bet.save();
      } catch (err) {
        console.error(err);
        res.status(500).json({ 
          success: false, 
          message: "Error saving bet", 
          error: err.message 
        });
      }
    }

    const formattedBets = bets.map(bet => {
      const betInfo = `${bet.gameType} - ${bet.betType} - ${bet.betNumber || bet.singleDigit || bet.panaNumber}`;
      return {
        gameId: bet.gameId,
        gameType: bet.gameType,
        betDetails: betInfo,
        amount: bet.amount,
        status: bet.status,
        winningAmount: bet.winningAmount,
        date: bet.createdAt
      };
    });

    try {
      res.status(200).json({ success: true, data: formattedBets });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        success: false, 
        message: "Error sending response", 
        error: err.message 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message, 
      error: err.message 
    });
  }
};

const getAllUsersStarlineBetDetailedHistory = async (req, res) => {
  try {
    const bets = await StarlineBet.find()
      .populate("userId", "name email")
      .populate("gameId", "name closeTime gameName")
      .sort({ createdAt: -1 });

    // Format each bet to show the proper bet info
    const formattedBets = bets.map(bet => {
      let betInfo = "";
      switch (bet.gameType.toLowerCase()) {
        case "single":
          betInfo = `Digit: ${bet.singleDigit}`;
          break;
        case "jodi":
          betInfo = `Jodi: ${bet.betNumber}`;
          break;
        case "singlepana":
        case "doublepana":
        case "triplepana":
          betInfo = `Pana: ${bet.panaNumber}`;
          break;
        case "half sangam":
          betInfo = `Open Pana: ${bet.openPana}, Close Digit: ${bet.closeDigit}`;
          break;
        case "full sangam":
          betInfo = `Open Pana: ${bet.openPana}, Close Pana: ${bet.closePana}`;
          break;
        default:
          betInfo = "Invalid type";
      }

      // For jodi, half sangam, full sangam: show gameType as betType, else show betType
      let showBetType = bet.betType;
      if (
        ["jodi", "half sangam", "full sangam"].includes(
          bet.gameType.toLowerCase()
        )
      ) {
        showBetType = bet.gameType;
      }

      return {
        _id: bet._id,
        userId: {
          _id: bet.userId._id,
          name: bet.userId.name,
          email: bet.userId.email
        },
        game: {
          name: bet.gameId?.gameName || "N/A",
          closeTime: bet.gameId?.closeTime || "N/A"
        },
        gameType: bet.gameType,
        betType: showBetType,
        betInfo: betInfo,
        amount: bet.amount,
        status: bet.status,
        winningAmount: bet.winningAmount,
        date: bet.date
      };
    });

    res.status(200).json({ success: true, data: formattedBets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: "An unexpected error occurred" 
    });
  }
};

module.exports = { placeBet, getStarlineBetStatus, getAllUsersStarlineBetDetailedHistory };
