const express = require('express');
const router = express.Router();
const {
  addTriplePana,
  getAllTriplePanas,
  getTriplePanasByUser,
  deleteTriplePana,
  updateTriplePana
} = require('../../Controller/gamecontroller/TriplePanacontroller');

const { protect } = require('../../middleware/authMiddleware'); // make sure you have this middleware for JWT

// 🔹 Create new Triple Pana (protected route)
router.post('/add', protect, addTriplePana);

// 🔹 Get all Triple Panas
router.get('/all', getAllTriplePanas);

// 🔹 Get Triple Panas by User ID
router.get('/user/:userId', getTriplePanasByUser);

// 🔹 Delete a Triple Pana by ID
router.delete('/:id', deleteTriplePana);

// 🔹 Update a Triple Pana by ID
router.put('/:id', updateTriplePana);

module.exports = router;
