const express = require('express');

// models
const { Characters: charactersModel } = require('../models/Characters');
const { UnlockedCharacters: unlockedCharactersModel } = require('../models/UnlockedCharacters'); // <-- ADD THIS

/**
 * @module controllers/character
 * @description Handles all of the logic for fetching character data that is then sent to various pages.
 */

/**
 * @async
 * @function getAllCharacters
 * @memberof module:controllers/character
 * @description Gets all characters even if they are not unlocked (SQL query is in Characters model).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
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
 * @function getCharactersByTrait
 * @memberof module:controllers/character
 * @description Gets all the character with a specific trait using traitID (SQL query is in the Characters model).
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
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
 * @returns {Promise<Void>}
 */
async function getUnlockedCharacters(req, res) {
    try {
        if (!req.session.isAuth || !req.session.accountID) {
            // Return rejected promise instead of throwing
            return Promise.reject(new Error('User not authenticated'));
        }

        const characters = await unlockedCharactersModel.selectAllWithTraits(req.session.accountID);
        
        const formattedCharacters = characters.map(char => ({
            ...char,
            unlocked: true,  
            image: char.image_path 
        }));

        const unlockedCount = formattedCharacters.length;
        const totalCount = 20; 
        const allCharacters = [];

        // Fill with unlocked characters first
        for (let i = 0; i < formattedCharacters.length; i++) {
            allCharacters.push(formattedCharacters[i]);
        }

        // Fill remaining slots with locked placeholders
        for (let i = formattedCharacters.length; i < totalCount; i++) {
            allCharacters.push({
                unlocked: false,
                image: '/images/lock_icon.png'
            });
        }

        res.render('pages/characters', {
            characters: allCharacters,
            unlockedCount,
            totalCount,
            isAuth: req.session.isAuth
        });
    } catch (error) {
        return Promise.reject(new Error('Failed to fetch unlocked characters'));
    }
}

module.exports = {
    getAllCharacters,
    getCharactersByTrait,
    getUnlockedCharacters
};

