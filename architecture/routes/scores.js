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

/**
 * GET
 * 
 * Router to get all the all scores form the database (for admin purposes).
 *
 * @name allScoresRoute
 * @function
 * @memberof module:routes/score
 */
router.get('/leaderboard-all', leaderboardController.getAllScores);

// DELETE requests
/**
 * DELETE
 * 
 * Router to delete a score (for admin purposes).
 *
 * @name deleteScoreRoute
 * @function
 * @memberof module:routes/score
 */
router.delete('/delete-score/:id', leaderboardController.deleteScore)

// exports
module.exports = router;
