const express = require('express');

// models
const { Games: gamesModel } = require('../models/Games');
const { Users: accountsModel } = require('../models/Users');

/**
 * @module controllers/leaderboard
 * @description Handles logic for leaderboard and sending page right data for displaying scores.
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
    let isAdmin = false;

    if(req.session.isAuth) {
        accountID = req.session.accountID;

        const rows = await accountsModel.selectByID(accountID);
        if (rows.length > 0 && rows[0].admin === 1) {
            isAdmin = true;
        }
    }

    // we then fetch all the scores in descending order from the games model
    games = await gamesModel.selectTopScores();

    // we then loop through, grab the top 5 scores and if the user is logged in their top score as well
    let scoresArr = [];
    for(let i = 0; i < games.length; i++) {
        if(i < 5) {
            scoresArr.push([i+1, games[i]]);
            if(accountID === games[i].userid)
                accountID = 0;
        }
        else if(accountID === 0)
            break;
        else if(accountID === games[i].userid) {
            scoresArr.push([i+1, games[i]]);
            break;
        }
    }

    // we then fetch all the scores in descending order (by money) from the games model
    moneyGames = await gamesModel.selectTopMoney();

    // we then loop through, grab the top 5 highest money games and if the user is logged in their top money as well
    let moneyArr = [];
    for(let i = 0; i < moneyGames.length; i++) {
        if(i < 5) {
            moneyArr.push([i+1, moneyGames[i]]);
            if(accountID === moneyGames[i].userid)
                accountID = 0;
        }
        else if(accountID === 0)
            break;
        else if(accountID === moneyGames[i].userid) {
            moneyArr.push([i+1, moneyGames[i]]);
            break;
        }
    }

    const activeCategory = req.query.category || 'score';
    // renders the leaderboard page
    res.render('pages/leaderboard', {
        scoresArr, 
        moneyArr,
        activeCategory,
        isAdmin: isAdmin
    });
};

/**
 * @async
 * @function getAllScores
 * @memberof module:controllers/character
 * @description Gets all the scores from the database (used for admin purposes).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getAllScores(req, res) {
    try {
        const games = await gamesModel.selectTopScores();
        res.json(games); 
    } catch (error) {
        console.error('Error fetching all scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
}

/**
 * @async
 * @function getAllScores
 * @memberof module:controllers/character
 * @description Deletes a score from the database (used for admin purposes).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function deleteScore(req, res) {
    try {
        const { id } = req.params;
        const result = await gamesModel.removeGame(id);
        res.json({ success: true, deletedId: id }); 
    } catch (error) {
        console.error('Error deleting score:', error);
        res.status(500).json({ error: 'Failed to delete score' });
    }
}


module.exports = {getHighScores, getAllScores, deleteScore};
