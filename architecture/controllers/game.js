const express = require('express');

const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const {alertRedirect, noAlert} = require('../utility');

class Game {

    // a private key, which makes our constructor private to anything outside the class.
    static #privateKey = {};

    // a hardcoded list of all available actions
    static #allActions = [
        'Food',
        'Small Gift',
        'Compliments',
        'Invite Out',
        'Help at Work',
        'Large Gift',
        'Getting Drive',
        'Help with Groceries',
        'Surprise'];

    /* Constructs a Game from game objects. */
    constructor(characters, score, money, round, key) {

        if(key !== MyClass.#privateKey)
            throw new Error('Cannot instantiate directly. Rather, use \'initGame\' instead.');

        this.characters = characters;
        this.score = score;
        this.money = money;
        this.round = round;

        this.hasEnded = false;
    }

    /* Initializes the Game from our game objects (like characters, score, etc.). Uses the factory-method template to replace the use of a constructor. */
    static async init(req, res) {

        // checks if the user's current session is authenticated.
        if(!req.session.isAuth)
            return alertRedirect(req, res, "Authentication is required to play game.", '/');

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
        noAlert(req, res, "Game initialized successful.");

        // returns the Game object
        return new Game(characters, 100, 50, 1, Game.#privateKey);
    };

    /* Plays a round of our game. */
    async playRound(req, res) {
    
        // finds which character the player chose
        const charIndex = req.body.char_index;

        // randomly selects three actions from the list of actions
        const actions = uniqueRandomItems(Game.#allActions, 3);

        // TODO: send actions back to HTML and CSS for player to choose from

        // finds which action the player chose
        const actionIndex = req.body.action_index;

        // checks to see if a character was ignored or else if the action chosen corresponds negatively or positively to any of that character's traits
        if(actionIndex >= actions.length)
            this.characters[charIndex].decrementHealth(5);

        for(const trait of this.characters[charIndex].character.traits) {

            if(trait.trait_name !== actions[actionIndex])
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

        // TODO: send healths back to HTML for player to see

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
        noAlert(req, res, "Game round ended successful.");
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

module.exports = {Game};
