const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

class UnlockedCharacters {

    static async selectAllWithTraits() {
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
            ORDER BY c.difficulty ASC`, [req.session.accountID]);
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

    static async addUnlockable(userID, characterID) {
        const insertSQL = 'INSERT INTO unlocked_characters (userid, characterid) VALUES (?, ?)';
        return await connection.query(insertSQL, [userID, characterID]);
    }

    static async isUnlocked(userID, characterID) {

        const selectSQL = 'SELECT * FROM unlocked_characters WHERE userid=? AND characterid=?';

        const [results] = connection.query(selectSQL, [userID, characterID]);
        return results.length > 0;
    }

    static async selectRandom(userID, num) {
        const [characters] = await connection.query('SELECT * FROM characters ORDER BY RAND() LIMIT' + num);
        return characters;
    }

    static async selectFromNames(userID, names) {

        selectSQL = 'SELECT * FROM characters c WHERE c.name IN (?)';

        const [characters] = await connection.query(selectSQL, [names.toString()]);
        return characters;
    }
}

exports.UnlockedCharacters = UnlockedCharacters;