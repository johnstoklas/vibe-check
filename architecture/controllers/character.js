const express = require('express');

// models
const { Characters: charactersModel } = require('../models/Characters');
const { UnlockConditions } = require('../models/UnlockConditions');
const { UnlockedCharacters: unlockedCharactersModel } = require('../models/UnlockedCharacters'); // <-- ADD THIS

// Gets all characters
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


// Gets characters by trait
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

// Gets unlocked characters for current user
async function getUnlockedCharacters(req, res) {
    try {
        if (!req.session.accountID)
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
    getCharactersByTrait,
    getUnlockedCharacters,
    checkCharacterUnlock
};

