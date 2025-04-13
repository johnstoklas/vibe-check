const express = require('express');

// models and utility
const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const gamesModel = require('../models/Games').Games;
const {alertRedirect, noAlertRedirect, waitForValue, waitForDifference} = require('../utility');

// miscellaneous
var game;

// middleware
/* Checks for player authentication and renders the game page. */
async function startGame(req, res) {

    // checks if the user's current session is authenticated
    if(!req.session.isAuth)
        return alertRedirect(req, res, "Authentication is required to play game.", '/');

    // renders the game page
    res.render('pages/game');
};

/* Starts and plays the game and dynamically displays gameplay to the user, using the WebSocket API with Express. */
async function playGame(ws, req) {

    // logs a connection message with the client
    console.log("New client connected");

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

            // stores the game in the database, including the score and money, once the game ends
            if (game.hasEnded) {
                await gamesModel.addGame(req.session.accountID, game.score, game.money);
                ws.send(JSON.stringify({ type: "end", message: "Game over!", gameState: game }));
            }
        }
    });

    // closes the connection to the client
    ws.on("close", () => {
        console.log("Client disconnected");
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
        this.isValidAction = false;
    }

    /* Initializes the Game by generating starting game objects (like characters, score, etc.). Uses the factory-method template to replace the use of a constructor. */
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
        return new Game(characters, 0, 50, 1, Game.#privateKey);
    };

    /* Runs a single round of our game. */
    async runRound(ws, state) {

        // make sure the game has not ended yet before the round can play out
        if(this.hasEnded) return;
    
        // finds which character and action the player chose
        const charIndex = state.char_index;
        const actionIndex = state.action_index;


        // checks if user clicked on the same character twice
        /*if(charIndex == state.previous_char_index) {
            ws.send(JSON.stringify({type: "invalidPlay",}));
            return;
        }*/

        //checks if a character has been ignored
        if(state.was_ignored) {
            this.characters[state.char_index].decrementHealth(5);

            // checks whether any characters' health is equal to zero
            for(const char of this.characters)
                if(char.health === 0)
                    this.hasEnded = true;

            ws.send(JSON.stringify({
                type: "update",
                gameState: this,
            }));
            return;
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
        }
        else {
            return;
        }

        const traits = this.characters[charIndex].character.traits
            .split(/\),\s*\(/)                    
            .map(s => s.replace(/[()]/g, ""))     
            .map(s => {
                const [name, good] = s.split(", ");
                return { name, goodtrait: parseInt(good) };
            });

        // checks if the action should postively or negatively affect player score and character health
        for(const trait of traits) {
            if(trait.name !== this.currentActions[actionIndex].name)
                continue;
            
            if(trait.goodtrait === 1) {
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

            if(currentChar.interactionlessRounds > 0)
                currentChar.decrementHealth(2 * currentChar.interactionlessRounds);
        }

        // checks whether any characters' health is equal to zero
        for(const char of this.characters)
            if(char.health === 0)
                this.hasEnded = true;

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

    /* Grabs random unique items from an array without changing the original array. */
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
}

module.exports = {startGame, playGame, Game};
