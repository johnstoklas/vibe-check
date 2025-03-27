const express = require('express');
const Character = require('../models/Character');
const UnlockedCharacter = require('../models/UnlockedCharacter');


const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

const characterController = {
    // Get all characters
    getAllCharacters: async (req, res) => {
        try {
            const [characters] = await connection.query(`
                SELECT 
                    c.characterid,
                    c.name,
                    c.difficulty,
                    GROUP_CONCAT(t.trait_name) as traits
                FROM characters c
                LEFT JOIN character_traits ct ON c.characterid = ct.characterid
                LEFT JOIN traits t ON ct.trait_id = t.id
                GROUP BY c.characterid, c.name, c.difficulty
                ORDER BY c.difficulty ASC
            `);

            res.json({
                data: characters.map(char => ({
                    ...char,
                    traits: char.traits ? char.traits.split(',') : []
                }))
            });
        } catch (error) {
            throw new Error('Failed to fetch characters');
        }
    },

    // Get all traits
    getAllTraits: async (req, res) => {
        try {
            const [traits] = await connection.query('SELECT id, trait_name FROM traits ORDER BY trait_name');
            res.json({ data: traits });
        } catch (error) {
            throw new Error('Failed to fetch traits');
        }
    },

    // Get characters by trait
    getCharactersByTrait: async (req, res) => {
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

            res.json({
                data: characters.map(char => ({
                    ...char,
                    traits: char.traits ? char.traits.split(',') : []
                }))
            });
        } catch (error) {
            throw new Error('Failed to fetch characters by trait');
        }
    },

    // Get unlocked characters for current user
    getUnlockedCharacters: async (req, res) => {
        try {
            if (!req.session.accountID) {
                throw new Error('User not authenticated');
            }

            const [characters] = await connection.query(`
                SELECT 
                    c.characterid,
                    c.name,
                    c.difficulty,
                    GROUP_CONCAT(t.trait_name) as traits
                FROM characters c
                INNER JOIN unlocked_characters uc ON c.characterid = uc.characterid
                LEFT JOIN character_traits ct ON c.characterid = ct.characterid
                LEFT JOIN traits t ON ct.trait_id = t.id
                WHERE uc.userid = ?
                GROUP BY c.characterid, c.name, c.difficulty
                ORDER BY c.difficulty ASC
            `, [req.session.accountID]);

            res.json({
                data: characters.map(char => ({
                    ...char,
                    traits: char.traits ? char.traits.split(',') : []
                }))
            });
        } catch (error) {
            throw new Error('Failed to fetch unlocked characters');
        }
    },

    // Add trait to character (admin only)
    addTraitToCharacter: async (req, res) => {
        try {
            const { characterId, traitId } = req.params;

            // Check if character exists
            const [character] = await connection.query(
                'SELECT characterid FROM characters WHERE characterid = ?',
                [characterId]
            );

            if (character.length === 0) {
                throw new Error('Character not found');
            }

            // Check if trait exists
            const [trait] = await connection.query(
                'SELECT id FROM traits WHERE id = ?',
                [traitId]
            );

            if (trait.length === 0) {
                throw new Error('Trait not found');
            }

            // Check if relationship already exists
            const [existing] = await connection.query(
                'SELECT * FROM character_traits WHERE characterid = ? AND trait_id = ?',
                [characterId, traitId]
            );

            if (existing.length > 0) {
                throw new Error('Trait already assigned to character');
            }

            // Add the trait
            await connection.query(
                'INSERT INTO character_traits (characterid, trait_id) VALUES (?, ?)',
                [characterId, traitId]
            );

            // Get updated character info
            const [updatedChar] = await connection.query(`
                SELECT 
                    c.characterid,
                    c.name,
                    c.difficulty,
                    GROUP_CONCAT(t.trait_name) as traits
                FROM characters c
                LEFT JOIN character_traits ct ON c.characterid = ct.characterid
                LEFT JOIN traits t ON ct.trait_id = t.id
                WHERE c.characterid = ?
                GROUP BY c.characterid, c.name, c.difficulty
            `, [characterId]);

            res.json({
                message: 'Trait added successfully',
                data: {
                    ...updatedChar[0],
                    traits: updatedChar[0].traits ? updatedChar[0].traits.split(',') : []
                }
            });
        } catch (error) {
            throw error;
        }
    },

    // Remove trait from character (admin only)
    removeTraitFromCharacter: async (req, res) => {
        try {
            const { characterId, traitId } = req.params;

            // Check if relationship exists
            const [existing] = await connection.query(
                'SELECT * FROM character_traits WHERE characterid = ? AND trait_id = ?',
                [characterId, traitId]
            );

            if (existing.length === 0) {
                throw new Error('Trait not assigned to character');
            }

            // Remove the trait
            await connection.query(
                'DELETE FROM character_traits WHERE characterid = ? AND trait_id = ?',
                [characterId, traitId]
            );

            // Get updated character info
            const [updatedChar] = await connection.query(`
                SELECT 
                    c.characterid,
                    c.name,
                    c.difficulty,
                    GROUP_CONCAT(t.trait_name) as traits
                FROM characters c
                LEFT JOIN character_traits ct ON c.characterid = ct.characterid
                LEFT JOIN traits t ON ct.trait_id = t.id
                WHERE c.characterid = ?
                GROUP BY c.characterid, c.name, c.difficulty
            `, [characterId]);

            res.json({
                message: 'Trait removed successfully',
                data: {
                    ...updatedChar[0],
                    traits: updatedChar[0].traits ? updatedChar[0].traits.split(',') : []
                }
            });
        } catch (error) {
            throw error;
        }
    }
};

module.exports = characterController;