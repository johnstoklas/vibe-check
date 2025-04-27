const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Characters {

    static async selectAllWithTraits() {
        const [characters] = await connection.query(`
            SELECT 
                c.characterid, 
                name, 
                difficulty, 
                characterimage, 
                GROUP_CONCAT(CONCAT('(', t.trait_name, ', ', t.goodtrait, ')')) AS traits
            FROM characters c
            LEFT JOIN character_traits ct ON c.characterid=ct.characterid
            LEFT JOIN traits t ON ct.trait_id=t.id
            GROUP BY c.characterid
            ORDER BY c.difficulty ASC
        `);
        return characters;
    };

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

    static async selectAll() {
        const [characters] = await connection.query('SELECT * FROM characters');
        return characters;
    }

    static async selectById(characterID) {
        const [charactersByID] = await connection.query('SELECT * FROM characters WHERE characterid=?', [characterID], (err, results));
        return charactersByID[0];
    }

}

exports.Characters = Characters;
