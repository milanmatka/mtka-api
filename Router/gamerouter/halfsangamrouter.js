const express = require('express');
const router = express.Router();
const {
  addHalfSangam,
  getAllHalfSangam,
  getHalfSangamByUser,
  deleteHalfSangam,
  updateHalfSangam,
} = require('../../Controller/gamecontroller/halfsangamcontroller');

const { protect } = require('../../middleware/authMiddleware');

// 🔸 Create new Half Sangam entry
router.post('/add', protect, addHalfSangam);

// 🔸 Get all entries
router.get('/all', protect, getAllHalfSangam);

// 🔸 Get by user ID
router.get('/user/:userId', protect, getHalfSangamByUser);

// 🔸 Delete by ID
router.delete('/:id', protect, deleteHalfSangam);

// 🔸 Update by ID
router.put('/:id', protect, updateHalfSangam);

module.exports = router;
