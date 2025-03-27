const express = require('express');
const router = express.Router();

// controllers
const characterController = require('../controllers/auth.js');
const gameController = require('../controllers/game.js');
const leaderboardController = require('../controllers/leaderboard.js');

// GET requests
// TODO: router.get('/play', characterController.getUnlockedCharacters);
// TODO: router.get('/leaderboard', leaderboardController.getHighScores);

// POST requests
// TODO: router.post('/onEndGame', gameController.sendScore);

// exports
module.exports = router;
