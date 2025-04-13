const express = require('express');
const router = express.Router();

// controllers
const gameController = require('../controllers/game.js');

// GET requests through HTTP
router.get('/', gameController.startGame);

// WebSocket request
router.ws('/', gameController.playGame);

// exports
module.exports = router;
