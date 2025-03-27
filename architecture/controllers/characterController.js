const express = require('express');
const Character = require('../models/Character');
const UnlockedCharacter = require('../models/UnlockedCharacter');


const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

const characterController = {
    // Get all characters
    getAllCharacters: async (req, res) => {
        try {
            const characters = await Character.findAll();
            res.json(characters);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching characters', error: error.message });
        }
    },

    // Get character by ID
    getCharacterById: async (req, res) => {
        try {
            const character = await Character.findById(req.params.id);
            if (!character) {
                return res.status(404).json({ message: 'Character not found' });
            }
            res.json(character);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching character', error: error.message });
        }
    },

    // Get user's unlocked characters
    getUnlockedCharacters: async (req, res) => {
        try {
            const userid = req.user.userid; // Assuming you have user info in req.user from auth middleware
            const unlockedCharacters = await UnlockedCharacter.findByUserId(userid);
            res.json(unlockedCharacters);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching unlocked characters', error: error.message });
        }
    },

    // Unlock a character for a user
    unlockCharacter: async (req, res) => {
        try {
            const userid = req.user.userid; // Assuming you have user info in req.user from auth middleware
            const { characterid } = req.body;

            // Check if character exists
            const character = await Character.findById(characterid);
            if (!character) {
                return res.status(404).json({ message: 'Character not found' });
            }

            // Check if already unlocked
            const isUnlocked = await UnlockedCharacter.isUnlocked(userid, characterid);
            if (isUnlocked) {
                return res.status(400).json({ message: 'Character already unlocked' });
            }

            // Unlock the character
            await UnlockedCharacter.unlock(userid, characterid);
            res.status(201).json({ message: 'Character unlocked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unlocking character', error: error.message });
        }
    }
    
};

const getAllTraits = async (req, res) => {
    try {
        const [traits] = await connection.query(
            'SELECT id, trait_name FROM traits ORDER BY trait_name ASC'
        );
        res.json(traits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching traits', error: error.message });
    }
};

// Get characters by trait
const getCharactersByTrait = async (req, res) => {
    try {
        const { traitId } = req.params;
        
        const [characters] = await connection.query(`
            SELECT DISTINCT 
                c.characterid,
                c.name,
                c.difficulty,
                GROUP_CONCAT(t.trait_name) as traits
            FROM characters c
            INNER JOIN character_traits ct ON c.characterid = ct.characterid
            INNER JOIN traits t ON ct.trait_id = t.id
            WHERE ct.trait_id = ?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY c.difficulty ASC
        `, [traitId]);

        // Format the traits into an array
        const formattedCharacters = characters.map(char => ({
            ...char,
            traits: char.traits ? char.traits.split(',') : []
        }));

        res.json(formattedCharacters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching characters by trait', error: error.message });
    }
};

// Add trait to character (admin only)
const addTraitToCharacter = async (req, res) => {
    try {
        const { characterId, traitId } = req.params;

        // Check if character exists
        const [character] = await connection.query(
            'SELECT characterid FROM characters WHERE characterid = ?',
            [characterId]
        );

        if (character.length === 0) {
            return res.status(404).json({ message: 'Character not found' });
        }

        // Check if trait exists
        const [trait] = await connection.query(
            'SELECT id FROM traits WHERE id = ?',
            [traitId]
        );

        if (trait.length === 0) {
            return res.status(404).json({ message: 'Trait not found' });
        }

        // Check if relationship already exists
        const [existing] = await connection.query(
            'SELECT * FROM character_traits WHERE characterid = ? AND trait_id = ?',
            [characterId, traitId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Trait already assigned to character' });
        }

        // Add the trait
        await connection.query(
            'INSERT INTO character_traits (characterid, trait_id) VALUES (?, ?)',
            [characterId, traitId]
        );

        res.status(201).json({ message: 'Trait added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding trait to character', error: error.message });
    }
};

// Remove trait from character (admin only)
const removeTraitFromCharacter = async (req, res) => {
    try {
        const { characterId, traitId } = req.params;

        // Check if relationship exists
        const [existing] = await connection.query(
            'SELECT * FROM character_traits WHERE characterid = ? AND trait_id = ?',
            [characterId, traitId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Trait not assigned to character' });
        }

        // Remove the trait
        await connection.query(
            'DELETE FROM character_traits WHERE characterid = ? AND trait_id = ?',
            [characterId, traitId]
        );

        res.json({ message: 'Trait removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing trait from character', error: error.message });
    }
};

module.exports = {characterController,
    getAllTraits,
    getCharactersByTrait,
    addTraitToCharacter,
    removeTraitFromCharacter
};