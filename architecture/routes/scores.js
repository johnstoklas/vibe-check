const express = require('express');
const router = express.Router();

/**
 * @module routes/score
 * @description Handles routing for the leaderboard page.
 */

// controllers
const characterController = require('../controllers/auth.js');
const gameController = require('../controllers/game.js');
const leaderboardController = require('../controllers/leaderboard.js');

// GET requests
// TODO: router.get('/play', characterController.getUnlockedCharacters);
/**
 * GET
 * 
 * On load of leaderboard page, we call getHighScores in the leaderboard controller.
 *
 * @name leaderboardPageRoute
 * @function
 * @memberof module:routes/score
 */
router.get('/', leaderboardController.getHighScores);

// POST requests
// TODO: router.post('/onEndGame', gameController.sendScore);

// exports
module.exports = router;
