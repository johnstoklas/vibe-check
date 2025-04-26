const express = require('express');

// models and utility
const gamesModel = require('../models/Games').Games;
const {alertRedirect, noAlertRedirect, waitForValue, waitForDifference} = require('../utility');

/**
 * @module controllers/leaderboard
 */

/**
 * @async
 * @function getHighScores
 * @memberof module:controllers/character
 * @description Gets the top 5 scores (regardless if they are all by the same user) and then the users top score.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getHighScores(req, res) {

    // if the user is authenticated we grab their account ID
    let accountID = 0;

    if(req.session.isAuth)
        accountID = req.session.accountID;

    // we then fetch all the scores in descending order from the games model
    games = await gamesModel.selectTopScores();


    // we then loop through, grab the top 5 scores and if the user is logged in their top score as well
    let gamesArr = [];
    for(let i = 0; i < games.length; i++) {
        if(i < 5)
            gamesArr.push([i+1, games[i]]);
        else if(accountID === 0)
            break;
        else if(accountID === games[i].userid) {
            gamesArr.push([i+1, games[i]]);
            break;
        }
    }

    // renders the leaderboard page
    res.render('pages/leaderboard', {gamesArr});
};

module.exports = {getHighScores};
