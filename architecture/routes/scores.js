const express = require('express');
const router = express.Router();

/**
 * @module routes/score
 * @description Handles routing for the leaderboard page.
 */

// controllers
const leaderboardController = require('../controllers/leaderboard.js');

// GET requests
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

router.get('/leaderboard-all', leaderboardController.getAllScores);

router.delete('/delete-score/:id', leaderboardController.deleteScore)

// exports
module.exports = router;
