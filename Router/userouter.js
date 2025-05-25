const express = require('express');
const router = express.Router();
const { register, login, updatePassword, adminLogin, promoteToAdmin ,getAllUsers } = require('../Controller/usercontroller');
const { protect, adminProtect } = require('../middleware/authMiddleware'); // Ensure correct import

router.post('/register', register);
router.post('/login',  login);
router.put('/update-Password',protect, updatePassword);

router.post('/admin/login', adminLogin);

// Admin promotion route (only accessible by admins)
router.put('/admin/promote', protect, adminProtect, promoteToAdmin);

// Protected profile route
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

router.get('/admin/Allusers',  getAllUsers);

// get all users route (only accessible by admins)

module.exports = router;
