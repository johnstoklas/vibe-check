const express = require('express');

// models
const charactersModel = require('../models/Characters').Characters;
const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const traitsModel = require('../models/Traits').Traits;

/**
 * @module controllers/character
 */

/**
 * @async
 * @function getAllCharacters
 * @memberof module:controllers/character
 * @description Gets all characters even if they are not unlocked (SQL query is in Characters model).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getAllCharacters(req, res) {
    try {
        const characters = await charactersModel.selectAllWithTraits();
        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        throw new Error('Failed to fetch characters');
    }
};

/**
 * @async
 * @function getAllTraits
 * @memberof module:controllers/character
 * @description Gets all possible traits a character can have in order (SQL query is in Characters model).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getAllTraits(req, res) {
    try {
        const traits = await traitsModel.selectAllOrdered();
        res.json({ data: traits });
    } catch (error) {
        throw new Error('Failed to fetch traits');
    }
};

/**
 * @async
 * @function getCharactersByTrait
 * @memberof module:controllers/character
 * @description Gets all the character with a specific trait using traitID (SQL query is in the Characters model).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getCharactersByTrait(req, res) {
    try {
        const { traitID } = req.params;
        const characters = await charactersModel.selectByTrait(traitID);

        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        throw new Error('Failed to fetch characters by trait');
    }
};

/**
 * @async
 * @function getUnlockedCharacters
 * @memberof module:controllers/character
 * @description Gets all the unlocked characters for a specific user based on the session's user id.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {void}
 */
async function getUnlockedCharacters(req, res) {
    try {
        if (!req.session.isAuth)
            throw new Error('User not authenticated');
        const characters = await unlockedCharactersModel.selectAllWithTraits(req.session.accountID);

        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        if (error.message === 'User not authenticated') {
            throw error; 
        }
        throw new Error('Failed to fetch unlocked characters');
    }
};

module.exports = {
    getAllCharacters,
    getAllTraits,
    getCharactersByTrait,
    getUnlockedCharacters, 
};

