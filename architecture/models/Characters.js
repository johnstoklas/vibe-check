const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Characters
 * @description Handles all SQL queries for characters
 */

/**
 * @typedef {Object} Character
 * @property {int} characterid 
 * @property {string} name
 * @property {int} difficulty
 * @property {string} characterimage
 */
class Characters {

    /**
     * Retrieves all characters from the database along with their traits.
     * 
     * @async
     * @function selectAllWithTraits
     * @returns {Promise<Array<Character>>} 
    */
    static async selectAllWithTraits() {
        const [characters] = await connection.query(`
            SELECT 
                c.characterid, 
                name, 
                difficulty, 
                characterimage, 
                GROUP_CONCAT(CONCAT('(', t.trait_name, ', ', t.goodtrait, ')')) AS traits
            FROM characters c
            INNER JOIN character_traits ct ON c.characterid=ct.characterid
            INNER JOIN traits t ON ct.trait_id=t.id

            GROUP BY c.characterid
            ORDER BY c.difficulty ASC
        `);
        return characters;
    };

    /**
     * Fetches all characters with a specific trait.
     * 
     * @async
     * @function selectByTrait
     * @param {int} traitID
     * @returns {Promise<Array<Character>>} 
    */
    static async selectByTrait(traitID) {
        const [characters] = await connection.query(`
            SELECT DISTINCT 
                c.characterid,
                c.name,
                c.difficulty,
                GROUP_CONCAT(t.trait_name) as traits
            FROM characters c
            INNER JOIN character_traits ct ON c.characterid=ct.characterid
            INNER JOIN traits t ON ct.trait_id=t.id
            WHERE ct.trait_id=?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY c.difficulty ASC
        `, [traitID]);
        return characters;
    }

    /**
     * Fetches all characters regardless of unlocked.
     * 
     * @async
     * @function selectAll
     * @returns {Promise<Array<Character>>} 
    */
    static async selectAll() {
        const [characters] = await connection.query('SELECT * FROM characters');
        return characters;
    }

    /**
     * Fetches a character's data based on their id.
     * 
     * @async
     * @function selectById
     * @param {int} characterID
     * @returns {Promise<Array<Character>>} 
    */
    static async selectById(characterID) {
        const [charactersByID] = await connection.query('SELECT * FROM characters WHERE characterid=?', [characterID], (err, results));
        return charactersByID[0];
    }

}

<<<<<<< HEAD
module.exports = { charactersModel };

=======
module.exports = Characters;
>>>>>>> main
