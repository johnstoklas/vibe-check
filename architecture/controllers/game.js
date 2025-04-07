const express = require('express');

// models and utility
const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const {alertRedirect, noAlertRedirect, waitForValue, waitForDifference} = require('../utility');

// other fields
var game;

// middleware
/* Starts the game for the player and renders the game page. */
async function startGame(req, res) {

    // checks if the user's current session is authenticated
    if(!req.session.isAuth)
        return alertRedirect(req, res, "Authentication is required to play game.", '/');

    // checks to see if the game has already been initialized, and if not, waits for it to initialize
    if(!game)
        game = await Game.init(req, res);

    // renders the game page
    res.render('pages/game', {game: game});
};

/* Essentially plays the game and dynamically displays gameplay to the user, using the WebSocket API with Express. */
async function playGame(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    
}

// class definitions
/* Bundles all of our game objects together under a single Game object. */
class Game {

    // a private key, which makes our constructor private to anything outside the class
    static #privateKey = {};

    // a private hardcoded list of all available actions
    static #allActions = [
        {name: 'Food', cost: 15}, 
        {name: 'Small Gift', cost: 10},
        {name: 'Compliments', cost: 0},
        {name: 'Invite Out', cost: 0},
        {name: 'Help at Work', cost: 0},
        {name: 'Large Gift', cost: 50},
        {name: 'Getting Drive', cost: 5},
        {name: 'Help with Groceries', cost: 0},
        {name: 'Surprise', cost: 5}];

    /* Constructs a Game from game objects. */
    constructor(characters, score, money, round, key) {

        if(key !== Game.#privateKey)
            throw new Error('Cannot instantiate directly. Rather, use \'initGame\' instead.');

        this.characters = characters;
        this.score = score;
        this.money = money;
        this.round = round;

        this.hasEnded = false;
        this.reloadPage = false;
        this.isValidAction = false;
    }

    /* Initializes the Game by generating starting game objects (like characters, score, etc.). Uses the factory-method template to replace the use of a constructor. */
    static async init(req, res) {

        // declares that the game is running and stores it in the session
        req.session.isGameRunning = true;

        // preliminary information needed to create the game objects
        let randomChars = await unlockedCharactersModel.selectRandomWithTraits(req.session.accountID, 5);
        const startingHealth = 50;

        // initializes our characters
        let characters = [];
        for(const char of randomChars)
            characters.push({
                // field properties
                character: char,
                health: startingHealth,
                interactionlessRounds: 0,
                // function properties
                incrementHealth: (increment) => {
                    let incrementedHealth = this.health + increment;
                    this.health = (incrementedHealth > 100) ? 100 : incrementedHealth;
                },
                decrementHealth: (decrement) => {
                    let decrementedHealth = this.health - decrement;
                    this.health = (decrementedHealth < 0) ? 0 : decrementedHealth;
                }
            });

        // "initialized" the Game object successful
        console.log("Game initialized successful.");

        // returns the Game object
        return new Game(characters, 100, 50, 1, Game.#privateKey);
    };

    /* Runs a single round of our game. */
    async runRound(ws, req) {

        // make sure the game has not ended yet before the round can play out
        if(this.hasEnded) return;
    
        // finds which character the player chose
        const charIndex = req.body.char_index;

        // randomly selects three actions from the list of actions
        const actions = uniqueRandomItems(Game.#allActions, 3);

        // reloads page to display actions to frontend for player to choose from
        this.reloadPage = true;
        await waitForValue(() => this.reloadPage, false);
        console.log("Page has been reloaded!")

        // finds which action the player chose and decrements the cost of that action
        let actionIndex = req.body.action_index;
        this.isValidAction = false;

        while(!this.isValidAction) {
            if(actions[actionIndex].cost <= this.money) {
                this.isValidAction = true;
                this.money -= actions[actionIndex].cost;
            }
            else {
                await waitForDifference(() => req.body.action_index, actionIndex);
                actionIndex = req.body.action_index;
            }
        }

        // reloads page to display the player's new amount of money back to frontend for player to see
        this.reloadPage = true;
        await waitForValue(() => this.reloadPage, false);
        console.log("Page has been reloaded again!");

        // checks to see if a character was ignored or else if the action chosen corresponds negatively or positively to any of that character's traits
        if(actionIndex >= actions.length)
            this.characters[charIndex].decrementHealth(5);

        for(const trait of this.characters[charIndex].character.traits) {

            if(trait.trait_name !== actions[actionIndex].name)
                continue;
            
            if(trait.is_positive === 1) {
                this.characters[charIndex].incrementHealth(5);
                this.score += 5 * this.characters[charIndex].character.difficulty;
            }
            else {
                this.characters[charIndex].decrementHealth(10);
                this.score -= 5 * this.characters[charIndex].character.difficulty;
            }
            break;
        }

        // decrements health for characters who have had no interaction that round or previous rounds
        for(let i = 0; i < this.characters.length; i++) {
            
            const currentChar = this.characters[i];

            currentChar.interactionlessRounds += 1;
            if(i === charIndex)
                currentChar.interactionlessRounds = 0;

            currentChar.decrementHealth(2 * currentChar.interactionlessRounds);
        }

        // reloads page to display new healths back to frontend for player to see
        this.reloadPage = true;
        await waitForValue(() => this.reloadPage, false);
        console.log("Page has been reloaded once more!");

        // checks whether any characters' health is equal to zero
        for(const char of this.characters)
            if(char.health === 0)
                this.hasEnded = true;

        // given that the game has not ended yet,
        if(!this.hasEnded) {

            // increases money based on the score count
            if(this.score > 90)
                this.money += 10;
            else if(this.score > 90)
                this.money += 5;
            else if(this.score > 70)
                this.money += 1;

            // increments the round count
            this.round++;
        }

        // ends game round successful
        console.log("Game round ended successful.");
    }

    /* Sends the score. */
    async sendScore(req, res) {};

    /* Grabs random unique items from an array without changing the original array. */
    uniqueRandomItems(array, num) {
            
        arr = array.slice(0);

        items = [];
        for(let i = 0; i < num; i++) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            items.push(arr[randomIndex]);
            arr.splice(randomIndex, 1);
        }

        return items;
    }
}

module.exports = {startGame, playGame};
