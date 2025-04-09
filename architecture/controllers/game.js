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

        // fake body to trigger first round
        req.body = {
            char_index: 0,         // can be dummy value
            action_index: null     // waits for real action from frontend
        };
    
        await game.runRound(ws, req); // ✅ triggers the first update with actions
    }

    const state = {
        char_index: null,
        action_index: null
    }

    // runs subsequent rounds of the game
    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "character_selection") {
            state.char_index = data.char_index;

             // send char_index with null action to trigger action options
        req.body = {
            char_index: state.char_index,
            action_index: null
        };

        await game.runRound(ws, req); // 👈 triggers update with actions
        }

        if (data.type === "action_selection") {
            state.action_index = data.action_index;


            // puts the selections into fake req.body
            req.body = {
                char_index: state.char_index,
                action_index: state.action_index
            };

            // runs a round of the game
            await game.runRound(ws, req);

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

        console.log(randomChars);
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
        const actions = this.uniqueRandomItems(Game.#allActions, 3);

        // updates page to display actions to frontend for player to choose from
        ws.send(JSON.stringify({ type: "update", message: "Game update!", gameState: this }));
        ws.on("updated", () => {});
        console.log("Page has been updated!")

        // finds which action the player chose and decrements the cost of that action
        let actionIndex = req.body.action_index;
        this.isValidAction = false;

        if (req.body.action_index == null) {
            // only send actions
            const actions = this.uniqueRandomItems(Game.#allActions, 3);
            this.currentActions = actions; // store them to use later
          
            ws.send(JSON.stringify({
                type: "update",
                message: "Choose an action",
                gameState: this,
                actions: actions
            }));
            return;
        }

        const wasIgnore = actionIndex >= actions.length || !actions[actionIndex];

        if (process.env.NODE_ENV === 'test') {
            if (!wasIgnore && actions[actionIndex].cost <= this.money) {
                this.isValidAction = true;
                this.money -= actions[actionIndex].cost;
            }
        } else {
            while(!this.isValidAction) {
                if(actions[actionIndex].cost <= this.money) {
                    this.isValidAction = true;
                    this.money -= actions[actionIndex].cost;
                }
                else {
                    ws.send(JSON.stringify({ type: "invalid_action", message: "That is an invalid action!" }));
                    await ws.on("new_action", () => {});
                    actionIndex = req.body.action_index;
                }
            }
        }

        // updates page to display the player's new amount of money back to frontend for player to see
        ws.send(JSON.stringify({ type: "update", message: "Game update!", gameState: this }));
        ws.on("updated", () => {});
        console.log("Page has been updated again!")

        // checks to see if a character was ignored or else if the action chosen corresponds negatively or positively to any of that character's traits
        if(actionIndex >= actions.length)
            this.characters[charIndex].decrementHealth(5);

        console.log("traits: ", this.characters[charIndex].character.traits);

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

        // updates page to display new healths back to frontend for player to see
        ws.send(JSON.stringify({ type: "update", message: "Game update!", gameState: this }));
        ws.on("updated", () => {});
        console.log("Page has been updated once more!")

        // checks whether any characters' health is equal to zero
        for(const char of this.characters)
            if(char.health === 0)
                this.hasEnded = true;

        // given that the game has not ended yet,
        if(!this.hasEnded) {
            if(!wasIgnore) {

                // increases money based on the score count
                for (const char of this.characters) {
                    if (char.health > 90)
                        this.money += 10;
                    else if (char.health > 80)
                        this.money += 5;
                    else if (char.health > 70)
                        this.money += 1;
                }            
            }

            // increments the round count
            this.round++;
        }

        // updates page once more for final changes to the game state
        ws.send(JSON.stringify({ type: "update", message: "Game update!", gameState: this }));
        ws.on("updated", () => {});
        console.log("Page has been updated on final time for this round!")

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
