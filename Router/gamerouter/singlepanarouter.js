const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');

const {
  addSinglePana,
  getAllSinglePanas,
  getSinglePanasByUser,
  deleteSinglePana,
  updateSinglePana
} = require('../../Controller/gamecontroller/singlepanacontroller');

// Protected routes
router.post('/add', protect, addSinglePana);
router.get('/all', protect, getAllSinglePanas);
router.get('/user/:userId', protect, getSinglePanasByUser);
router.delete('/:id', protect, deleteSinglePana);
router.put('/:id', protect, updateSinglePana);

module.exports = router;
