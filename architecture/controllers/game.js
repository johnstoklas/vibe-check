const express = require('express');

const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const messageReturnEarly = require('../../other/utility').messageReturnEarly;

/* Plays the game. */
async function playGame(req, res) {

    if(!req.session.isAuth)
        return messageReturnEarly("Authentication is required to play game.", '/', res);

    let chars = await unlockedCharactersModel.selectRandom(req.session.accountID, 5);

    let areDeadChars = false;
    for(round = 1; !areDeadChars; round++) {
        // TODO: Add more
    }
};

/* Sends the score. */
async function sendScore(req, res) {};

module.exports = {sendScore};
