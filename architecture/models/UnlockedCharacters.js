const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class UnlockedCharacters {

    static async unlock(userID, characterID) {
        const insertSQL = 'INSERT INTO unlocked_characters (userid, characterid) VALUES (?, ?)';
        return await connection.query(insertSQL, [userID, characterID]);
    }

    static async isUnlocked(userID, characterID) {

        const selectSQL = 'SELECT * FROM unlocked_characters WHERE userid=? AND characterid=?';

        const [results] = connection.query(selectSQL, [userID, characterID]);
        return results.length > 0;
    }

    static async selectRandomWithTraits(userID, num) {
        const [characters] = await connection.query(`
            SELECT
                c.*,
                GROUP_CONCAT(t.trait_name) as traits
            FROM characters c
            INNER JOIN unlocked_characters uc ON c.characterid=uc.characterid
            LEFT JOIN character_traits ct ON c.characterid=ct.characterid
            LEFT JOIN traits t ON ct.trait_id=t.id
            WHERE uc.userid=?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY RAND() LIMIT ?`, [userID, num]);
        return characters;
    }

    static async selectFromNames(userID, names) {
        const [characters] = await connection.query(`
            SELECT c.*
            FROM characters c
            INNER JOIN unlocked_characters u ON c.characterid=u.characterid
            WHERE u.userid=? AND c.name IN (?)`, [userID, names.toString()]);
        return characters;
    }

    static async selectAllWithTraits(accountID) {
        const [characters] = await connection.query(`
            SELECT
                c.*,
                GROUP_CONCAT(t.trait_name) as traits
            FROM characters c
            INNER JOIN unlocked_characters uc ON c.characterid=uc.characterid
            LEFT JOIN character_traits ct ON c.characterid=ct.characterid
            LEFT JOIN traits t ON ct.trait_id=t.id
            WHERE uc.userid=?
            GROUP BY c.characterid, c.name, c.difficulty
            ORDER BY c.difficulty ASC`, [accountID]);
        return characters;
    }

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