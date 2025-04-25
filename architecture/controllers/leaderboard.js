const express = require('express');

// models
const gamesModel = require('../models/Games').Games;

/* Get high scores of users. */
async function getHighScores(req, res) {

    let accountID = 0;
    if(req.session.isAuth)
        accountID = req.session.accountID;

    games = await gamesModel.selectTopScores();

    let gamesArr = [];
    for(let i = 0; i < games.length; i++) {
        if(i <= 5)
            gamesArr.push([i, games[i]]);
        else if(accountID === 0)
            break;
        else if(accountID === games[i].userid) {
            gamesArr.push([i, games[i]]);
            break;
        }
    }

    console.log(gamesArr);
    res.render('pages/leaderboard', {gamesArr});
};

module.exports = {getHighScores};
