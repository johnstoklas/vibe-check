const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/UnlockedCharacters
 */

/**
 * @typedef {Object} Character
 * @property {int} characterid 
 * @property {string} name
 * @property {int} difficulty
 * @property {string} characterimage
 */

class UnlockedCharacters {

    /**
     * Adds a character to a user's possible pool of characters that can be played with.
     * 
     * @static
     * @async
     * @function unlock
     * @memberof models/unlockedCharacters
     * @param {int} userID 
     * @param {int} characterID
     * @returns {Promise<Void>} 
    */
    static async unlock(userID, characterID) {
        const insertSQL = 'INSERT INTO unlocked_characters (userid, characterid) VALUES (?, ?)';
        return await connection.query(insertSQL, [userID, characterID]);
    }

    /**
     * Checks if a character is already unlocked for a user.
     * 
     * @static
     * @async
     * @function isUnlocked
     * @memberof models/unlockedCharacters
     * @param {int} userID 
     * @param {int} characterID
     * @returns {Promise<Void>} 
    */
    static async isUnlocked(userID, characterID) {

        const selectSQL = 'SELECT * FROM unlocked_characters WHERE userid=? AND characterid=?';

        const [results] = connection.query(selectSQL, [userID, characterID]);
        return results.length > 0;
    }

    /**
     * Selects a random amount of characters of size 'num' from a user's unlocked characters. 
     * Traits are in the format: (Compliments, 1),(Invite Out, 1),(Help at Work, 1).
     * 
     * @static
     * @async
     * @function selectRandomWithTraits
     * @memberof models/unlockedCharacters
     * @param {int} userID 
     * @param {int} characterID
     * @returns {Promise<Array<Character>>} 
    */
    static async selectRandomWithTraits(userID, num) {
        const [characters] = await connection.query(`
            SELECT
                c.*,
                GROUP_CONCAT(CONCAT('(', t.trait_name, ', ', t.goodtrait, ')')) AS traits
            FROM characters c
            INNER JOIN unlocked_characters uc ON c.characterid=uc.characterid
            INNER JOIN character_traits ct ON c.characterid=ct.characterid
            INNER JOIN traits t ON ct.trait_id=t.id
            WHERE uc.userid=?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY RAND() LIMIT ?`, [userID, num]);
        return characters;
    }

    /**
     * Selects all characters regardless of unlocked with traits.
     * Traits are in the format: (Compliments, 1),(Invite Out, 1),(Help at Work, 1).
     * @static
     * @async
     * @function selectAllWithTraits
     * @memberof models/unlockedCharacters
     * @param {int} userID
     * @returns {Promise<Array<Character>>} 
    */
    static async selectAllWithTraits(userID) {
        const [characters] = await connection.query(`
            SELECT
                c.*,
                GROUP_CONCAT(CONCAT('(', t.trait_name, ', ', t.goodtrait, ')')) AS traits
            FROM characters c
            INNER JOIN unlocked_characters uc ON c.characterid=uc.characterid
            INNER JOIN character_traits ct ON c.characterid=ct.characterid
            INNER JOIN traits t ON ct.trait_id=t.id
            WHERE uc.userid=?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY c.difficulty ASC`, [userID]);
        return characters;
    }

    /**
     * Selects all characters that are unlocked.
     * 
     * @static
     * @async
     * @function selectByUserId
     * @memberof models/unlockedCharacters
     * @param {int} userID
     * @returns {Promise<Array<Character>>} 
    */
    static async selectByUserId(userID) {
        const [charactersByID] = await connection.query(`
            SELECT c.* 
            FROM characters c
            INNER JOIN unlocked_characters uc ON c.characterid=uc.characterid
            WHERE uc.userid=?
        `, [userID]);
        return charactersByID[0];
    }
}

exports.UnlockedCharacters = UnlockedCharacters;