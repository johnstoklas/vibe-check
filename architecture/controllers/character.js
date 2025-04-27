const express = require('express');

// models
const charactersModel = require('../models/Characters').Characters;
const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const { traitsModel } = require('../models/Traits');
const { UnlockConditions } = require('../models/UnlockConditions');

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

async function getOnlyGoodTraits(req, res) {
    try {
        const traits = await traitsModel.getgoodTrait(req.params.traitID);
        res.json({ data: traits });
    } catch (error) {
        throw new Error('Failed to fetch good trait');
    }
}

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

        // Check for new unlocks
        

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

// Check unlock conditions for a specific character
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
    getAllTraits,
    getOnlyGoodTraits,
    getCharactersByTrait,
    getUnlockedCharacters,
    checkCharacterUnlock
};

