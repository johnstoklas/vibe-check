const express = require('express');

// models
const { Characters: charactersModel } = require('../models/Characters');
const { UnlockConditions } = require('../models/UnlockConditions');
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
        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        return Promise.reject(new Error('Failed to fetch unlocked characters'));
    }
}

/**
 * @async
 * @function checkCharacterUnlock
 * @memberof module:controllers/character
 * @description Checks if a character was unlocked during the game that was just played.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function checkCharacterUnlock(req, res) {
    try {
        if (!req.session.accountID) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const characterId = parseInt(req.params.characterId);
        
        // Get all characters and check if this one is locked
        const unlockedCharacters = await unlockedCharactersModel.selectAllWithTraits(req.session.accountID);
        const unlockedIds = new Set(unlockedCharacters.map(char => char.characterid));

        // Check and unlock first 8 characters if they're not unlocked
        for (let i = 1; i <= 8; i++) {
            if (!unlockedIds.has(i)) {
                try {
                    await unlockedCharactersModel.unlock(req.session.accountID, i);
                    unlockedIds.add(i);
                    console.log(`Initial character ${i} unlocked for user ${req.session.accountID}`);
                } catch (unlockError) {
                    console.error(`Failed to unlock initial character ${i}:`, unlockError);
                }
            }
        }

        // Now check if the requested character is locked
        const isLocked = !unlockedIds.has(characterId);

        // Only check unlock conditions if character is locked
        if (isLocked) {
            const meetsConditions = await UnlockConditions.checkUnlockCondition(characterId, req.session.accountID);
            if (meetsConditions) {
                try {
                    await unlockedCharactersModel.unlock(req.session.accountID, characterId);
                    console.log(`Character ${characterId} unlocked for user ${req.session.accountID}`);
                    
                    res.json({
                        characterId,
                        isUnlocked: true,  
                        message: 'Character successfully unlocked!'
                    });
                } catch (unlockError) {
                    console.error(`Failed to unlock character ${characterId}:`, unlockError);
                    return res.status(500).json({ 
                        error: 'Failed to unlock character',
                        message: unlockError.message 
                    });
                }
            } else {
                res.json({
                    characterId,
                    isUnlocked: false,  
                    message: 'Unlock conditions not met'
                });
            }
        } else {
            res.json({
                characterId,
                isUnlocked: true,  
                message: 'Character is already unlocked'
            });
        }
    } catch (error) {
        console.error('Error in checkCharacterUnlock:', error);
        res.status(500).json({ 
            error: 'Failed to check character unlock status',
            message: error.message 
        });
    }
}

module.exports = {
    getAllCharacters,
    getCharactersByTrait,
    getUnlockedCharacters,
    checkCharacterUnlock
};

