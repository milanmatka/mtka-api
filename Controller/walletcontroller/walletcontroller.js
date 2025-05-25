// controllers/walletController.js
const Wallet = require('../../modal/walletmodal/walletmodal');
const User = require('../../modal/Usermodal'); // ✅ adjust path if needed
// const Bet = require('../../modal/betmodal');   // ✅ adjust path if needed
const WalletRequest = require('../../modal/walletmodal/WalletRequestmodal');


exports.addMoneyToWallet = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Create a new wallet request
    const walletRequest = new WalletRequest({
      user: userId,
      amount,
      note,
      status: 'pending',
    });

    await walletRequest.save();

    res.status(200).json({
      message: 'Request created successfully. Please wait for admin approval.',
      walletRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approve or reject wallet request
exports.manageWalletRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action is 'approve' or 'reject'
    const walletRequest = await WalletRequest.findById(requestId);

    if (!walletRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (walletRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    if (action === 'approve') {
      walletRequest.status = 'approved';
      // Add money to the user's wallet
      let wallet = await Wallet.findOne({ user: walletRequest.user });

      if (!wallet) {
        wallet = new Wallet({
          user: walletRequest.user,
          balance: walletRequest.amount,
          transactions: [{ amount: walletRequest.amount, type: 'credit', note: walletRequest.note }],
        });
      } else {
        wallet.balance += walletRequest.amount;
        wallet.transactions.push({ amount: walletRequest.amount, type: 'credit', note: walletRequest.note });
      }

      await wallet.save();
    } else if (action === 'reject') {
      walletRequest.status = 'rejected';
    }

    await walletRequest.save();

    res.status(200).json({ message: `Request ${action}d successfully`, walletRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//show all wallet requests
exports.getAllWalletRequests = async (req, res) => {
  try {
    const walletRequests = await WalletRequest.find().populate('user', 'name email');
    res.status(200).json(walletRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUserWalletsWithBets = async (req, res) => {
  try {
    const users = await User.find();

    const userWalletsWithBets = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ user: user._id });

        // const totalBets = await Bet.countDocuments({ user: user._id });

        return {
          userId: user._id,
          name: user.name,
          number: user.number,
          email: user.email,
          walletBalance: wallet ? wallet.balance : 0,
          transactions: wallet ? wallet.transactions : [],
          // totalBets,
        };
      })
    );

    res.status(200).json(userWalletsWithBets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};