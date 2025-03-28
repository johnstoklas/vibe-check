const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

const charactersModel = require('../models/Characters');
const unlockedCharactersModel = require('../models/UnlockedCharacters');

// Gets all characters
async function getAllCharacters (req, res) {
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
};

// Gets all traits
async function getAllTraits (req, res) {
    try {
        const [traits] = await connection.query('SELECT id, trait_name FROM traits ORDER BY trait_name');
        res.json({ data: traits });
    } catch (error) {
        throw new Error('Failed to fetch traits');
    }
};

// Gets characters by trait
async function getCharactersByTrait (req, res) {
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
};

// Gets unlocked characters for current user
async function getUnlockedCharacters (req, res) {
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
            ORDER BY c.difficulty ASC`, [req.session.accountID]);

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

module.exports = {
    getAllCharacters,
    getAllTraits,
    getCharactersByTrait,
    getUnlockedCharacters, 
};
