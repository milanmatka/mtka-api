const express = require('express');
const router = express.Router();
const {
  addDoublePana,
  getAllDoublePanas,
  getDoublePanasByUser,
  updateDoublePana,
  deleteDoublePana
} = require('../../Controller/gamecontroller/Doublepanacontroller');

const { protect } = require('../../middleware/authMiddleware');

// 🔐 Protected routes: Requires JWT token to access

// ➕ Create new Double Pana
router.post('/add', protect, addDoublePana);

// 📥 Get all Double Panas (Admin or report use)
router.get('/all', protect, getAllDoublePanas);

// 👤 Get Double Panas by logged-in user
router.get('/user', protect, getDoublePanasByUser);

// ✏️ Update a Double Pana by ID
router.put('/:id', protect, updateDoublePana);

// ❌ Delete a Double Pana by ID
router.delete('/:id', protect, deleteDoublePana);

module.exports = router;
