// walletRouter.js
const express = require('express');
const router = express.Router();

const { addMoneyToWallet, getWallet, getAllUserWalletsWithBets, getAllWalletRequests, manageWalletRequest } = require('../../Controller/walletcontroller/walletcontroller');

const { protect } = require('../../middleware/authMiddleware'); // ✅ FIXED

router.post('/add', protect, addMoneyToWallet); // ✅ This is now a function
router.get('/get', protect, getWallet);

router.get('/admin/all-wallets',  getAllUserWalletsWithBets);


// Admin route to approve/reject wallet requests
router.post('/admin/manage', manageWalletRequest); // Only admin should have access

// Admin route to get all wallet requests
router.get('/admin/requests', getAllWalletRequests);

// Admin route to get all wallet requests
// router.get('/admin/requests', protect, getAllWalletRequests);

module.exports = router;
