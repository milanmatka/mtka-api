const express = require('express');
const router = express.Router();
const {
  addFullSangam,
  getAllFullSangam,
  getFullSangamByUser,
  deleteFullSangam,
  updateFullSangam
} = require('../../Controller/gamecontroller/fullsangamcontroller');

// ✅ Auth middleware (optional, but assumed to be in use)
const { protect } = require('../../middleware/authMiddleware');

// 🔹 Create new full sangam entry
router.post('/add', protect, addFullSangam);

// 🔹 Get all entries
router.get('/all', getAllFullSangam);

// 🔹 Get entries by user
router.get('/user/:userId', getFullSangamByUser);

// 🔹 Delete entry by ID
router.delete('/:id', deleteFullSangam);

// 🔹 Update entry by ID
router.put('/:id', updateFullSangam);

module.exports = router;
