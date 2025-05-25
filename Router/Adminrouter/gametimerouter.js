const express = require('express');
const router = express.Router();
const gameTimeController = require('../../Controller/Admincontroller/gametimecontroller');

router.post('/setGameTime', gameTimeController.setGameTime);

module.exports = router;
