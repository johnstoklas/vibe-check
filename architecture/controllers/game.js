const express = require('express');

const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const traitsModel = require('../models/Traits').Traits;
const {alertRedirect, noAlert} = require('../utility');

var chars;
var healths;
var score;

/* Initializes (and starts) the game and the game objects. */
async function initGame(req, res) {

    // checks if the user's current session is authenticated.
    if(!req.session.isAuth)
        return alertRedirect(req, res, "Authentication is required to play game.", '/');

    // initializes the game objects
    chars = await unlockedCharactersModel.selectRandomWithTraits(req.session.accountID, 5);

    const startingHealth = 50;
    healths = Array(chars.length).fill(startingHealth);

    score = 0;

    // initialized the game successful
    noAlert(req, res, "Game initialized successful.");
};

async function playGameRound(req, res, round) {
 
    // TODO: find which character the player chose
    const charIndex = 0;

    // select random traits for the player to choose from as actions
    const actions = await traitsModel.selectRandom(3);

    // TODO: find which action the character chose
    const actionIndex = 0;

    // checks to see if any of that character's traits correspond negatively or positively to the action you chose
    for(let trait of chars[charIndex].traits) {

        if(trait.trait_id !== actions[actionIndex].trait_id)
            continue;
        
        isPos = true;
        if(isPos) 
            healths[charIndex] += 5;

        isNeg = false;
        if(isNeg)
            healths[charIndex] -= 10;
    }

    // game round ended successful
    noAlert(req, res, "Game round ended successful.");
}

/* Sends the score. */
async function sendScore(req, res) {};

module.exports = {sendScore};
