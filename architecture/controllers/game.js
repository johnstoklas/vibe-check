const express = require('express');

// models
const { UnlockedCharacters: unlockedCharactersModel }= require('../models/UnlockedCharacters');
const { Games: gamesModel} = require('../models/Games');
const { UnlockConditions } = require('../models/UnlockConditions');

/**
 * @module controllers/game
 * @description Handles all of the game functionality. This file is large and very important. 
 * This handles user inputs being sent to the backend via Web Sockets. We are initalizing a game session here
 * and also keep tracking of player health, player money, and character's health.
 */

// middleware
/**
 * @async
 * @function startGame
 * @memberof module:controllers/game
 * @description Checks for player authentication and renders the game page.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<void>}
 */
async function startGame(req, res) {

    // checks if the user's current session is authenticated
    if(!req.session.isAuth) {
        console.log("Authentication is required to play game.");
        return res.redirect("/");
    }

    // renders the game page
    res.render('pages/game');
};

/**
 * @async
 * @function playGame
 * @memberof module:controllers/game
 * @description Starts and plays the game and dynamically displays gameplay to the user, handling messages such as 
 * start game, character selction, action seleciton, and ignore character.
 * @param {express.Request} ws - The WebSocket connection.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<void>}
 */
async function playGame(ws, req) {

    // logs a connection message with the client
    console.log("New client connected");

    // initializes the game
    let game;

    // initializes the game
    if (game == null || game.hasEnded) {

        game = await Game.init(ws, req);

        ws.send(JSON.stringify({
            game: game,
            type: 'initGame',
        }));
    }

    // initializes game states
    const state = {
        char_index: null,
        previous_char_index: null,
        action_index: null,
        was_ignored: false,
    }

    // runs subsequent rounds of the game
    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "start_game") {
            game = await Game.init(ws, req);
            ws.send(JSON.stringify({
                game: game,
                type: 'initGame',
            }));
        }

        if (data.type === "character_selection") {
            state.char_index = data.char_index;
            state.was_ignored = false;
            state.action_index = -1;
            await game.runRound(ws, state); 
        }

        if (data.type === "action_selection") {
            state.action_index = data.action_index;
            state.was_ignored = false;

            // runs a round of the game
            await game.runRound(ws, state);

            // stores the game in the database, including the score and money, once the game ends
            if (game.hasEnded) {
                await gamesModel.addGame(req.session.accountID, game.score, game.money);
                ws.send(JSON.stringify({ type: "end", message: "Game over!", gameState: game }));
            }
        }

        if(data.type === "ignore_character") {
            state.was_ignored = true;

            // runs a round of the game
            await game.runRound(ws, state);
        }
    });

    // closes the connection to the client
    ws.on("close", () => {
        console.log("Client disconnected");
    });
}

/**
 * Bundles all of our game objects together under a single Game object.
 * 
 * @class
 * @memberof module:controllers/game
 */
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

    /**
     * @constructor
     * @param {Array<Character>} characters - The characters involved in the game, each with custom behavior
     * @param {number} score - Initial score for the game
     * @param {number} money - Starting money for the player
     * @param {number} round - The starting round number
     * @param {*} key - Private instantiation key
     */
    constructor(characters, score, money, round, key) {

        if(key !== Game.#privateKey)
            throw new Error('Cannot instantiate directly. Rather, use \'initGame\' instead.');

        this.characters = characters;
        this.score = score;
        this.money = money;
        this.round = round;

        this.hasEnded = false;
        this.isValidAction = false;
    }

    /**
     * @async
     * @description Initializes the Game by generating starting game objects (like characters, score, etc.). Uses the factory-method template to replace the use of a constructor. 
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {express.Response} req - The Express request object used to render the page or redirect.
     * @returns {Promise<Game>}
     */
    static async init(ws, req) {

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
                incrementHealth: function (increment) {
                    let incrementedHealth = this.health + increment;
                    this.health = (incrementedHealth > 100) ? 100 : incrementedHealth;
                },
                decrementHealth: function (decrement) {
                    let decrementedHealth = this.health - decrement;
                    this.health = (decrementedHealth < 0) ? 0 : decrementedHealth;
                }
            });

        // "initialized" the Game object successful
        console.log("Game initialized successful.");

        // returns the Game object
        const game = new Game(characters, 0, 50, 1, Game.#privateKey);
        game.accountID = req.session.accountID;
        return game;
    };

    /**
     * @async
     * @description Runs a single round of our game by updating score, money, and character health.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {Object} state - The game state.
     * @returns {Promise<void>}
     */
    async runRound(ws, state) {
        if (!this) {
            ws.send(JSON.stringify({ type: "error", message: "Game not initialized yet" }));
            return;
        }
          
        // make sure the game has not ended yet before the round can play out
        if(this.hasEnded) return;
    
        // finds which character and action the player chose
        const charIndex = state.char_index;
        const actionIndex = state.action_index;

        //checks if a character has been ignored
        if(state.was_ignored) {
            this.characters[state.char_index].decrementHealth(5);

            if (this.characters[state.char_index].health <= 0) {
                await this.handleGameOver(ws);
                return;
            }
        }

        // checks if we should rerandomize the actions
        if (actionIndex === -1 || state.previous_char_index !== state.char_index) {
            this.currentActions = this.uniqueRandomItems(Game.#allActions, 3);
            ws.send(JSON.stringify({
                type: "update",
                message: "Choose an action",
                gameState: this,
                actions: this.currentActions
            }));
            state.previous_char_index = state.char_index;
            return;
        }

        // checks if the player has enough money to pay for the action
        if (this.currentActions[actionIndex].cost <= this.money) {
            this.money -= this.currentActions[actionIndex].cost;
            ws.send(JSON.stringify({
                type: "valid_action",
                message: "You don't have enough money for that action!"
            }));
        }
        else {
            ws.send(JSON.stringify({
                type: "invalid_action",
                message: "You don't have enough money for that action!"
            }));
            return;
        }

        const traits = this.characters[charIndex].character.traits
            .split(/\),\s*\(/)                    
            .map(s => s.replace(/[()]/g, ""))     
            .map(s => {
                const [name, good] = s.split(", ");
                return { name, goodtrait: parseInt(good) };
            });


        // checks if the action should positively or negatively affect player score and character health
        for(const trait of traits) {
            if(trait.name.trim().toLowerCase() !== this.currentActions[actionIndex].name.trim().toLowerCase())
                continue;
            
            if(trait.goodtrait === 1) {
                this.characters[charIndex].incrementHealth(5);
                this.score += (5 * this.characters[charIndex].character.difficulty);
            }
            else {
                this.characters[charIndex].decrementHealth(10);
                this.score -= (5 * this.characters[charIndex].character.difficulty);
            }
            break;
        }
        
        // decrements health for characters who have had no interaction that round or previous rounds
        for(let i = 0; i < this.characters.length; i++) {
            
            const currentChar = this.characters[i];

            currentChar.interactionlessRounds += 1;
            if(i === charIndex)
                currentChar.interactionlessRounds = 0;

            if(currentChar.interactionlessRounds > 0)
                currentChar.decrementHealth(1 * currentChar.interactionlessRounds);
        }

        // Check if any character's health is 0 (game over condition)
        for (const char of this.characters) {
            if (char.health <= 0) {
                await this.handleGameOver(ws);
                return;
            }
        }

        // given that the game has not ended yet, the user should be rewarded money for happy characters
        if(!this.hasEnded) {

            // increases money based on the character's health
            for (const char of this.characters) {
                if (char.health > 90)
                    this.money += 10;
                else if (char.health > 80)
                    this.money += 5;
                else if (char.health > 70)
                    this.money += 1;
            }           

            // increments the round count
            this.round++;
        }

        // sets the current character state to the previous state to ensure we don't rerandomzie on accident
        state.previous_char_index = state.char_index;

        // updates page once more for final changes to the game state
        ws.send(JSON.stringify({ type: "update", message: "new update!", gameState: this }));

        // ends game round successful
        console.log("Game round ended successful.");
    }

    /**
     * @description Grabs random unique items from an array without changing the original array (used for randomizing actions).
     * @param {Array<Object>} array - Array of items to be randomized.
     * @param {Integer} num - The size of the array that is being returned.
     * @returns {Array<Object>}
     */
    uniqueRandomItems(array, num) {
            
        let arr = array.slice(0);

        let items = [];
        for(let i = 0; i < num; i++) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            items.push(arr[randomIndex]);
            arr.splice(randomIndex, 1);
        }

        return items;
    }

    async handleGameOver(ws) {
        this.hasEnded = true;

        const gamesPlayed = (await UnlockConditions.checkGamesPlayedUnlock(this.accountID)) + 1;

        const unlockCharacterArray = [];

        // Score-based unlocks
        if (this.score >= 100) {
            unlockCharacterArray.push(13);
        }
        if (this.score >= 75) {
            unlockCharacterArray.push(12);
        }
        if (this.score >= 50) {
            unlockCharacterArray.push(11);
        }
        if (this.score >= 40) {
            unlockCharacterArray.push(10);
        }
        if (this.score >= 30) {
            unlockCharacterArray.push(9);
        }

        // Games played unlocks
        if (gamesPlayed >= 60) {
            unlockCharacterArray.push(18);
        }
        if (gamesPlayed >= 40) {
            unlockCharacterArray.push(17);
        }
        if (gamesPlayed >= 25) {
            unlockCharacterArray.push(16);
        }
        if (gamesPlayed >= 10) {
            unlockCharacterArray.push(15);
        }
        if (gamesPlayed >= 5) {
            unlockCharacterArray.push(14);
        }

        // money-based unlocks
        if (this.money >= 70) {
            unlockCharacterArray.push(19);
        }

        // final character
        if (this.score >= 100 && this.money >= 100) {
            unlockCharacterArray.push(20);
        }
        
        for (const characterID of unlockCharacterArray) {
            await unlockedCharactersModel.unlock(this.accountID, characterID);
        }
        
        ws.send(JSON.stringify({ 
            type: "end", 
            message: "Game over!", 
            gameState: this 
        }));
    }
    
}

module.exports = {startGame, playGame, Game};
