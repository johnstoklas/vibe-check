const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Games
 * @description Handles SQL queries for adding a game to the database and grabbing all the scores.
 */

/**
 * @typedef {Object} Game
 * @property {int} gameid
 * @property {int} userid
 * @property {int} topscore
 * @property {int} topmoney
 * @property {string} dateachieved
 */

class Games {
    /**
     * Adds a game to the database once the game is over.
     * 
     * @async
     * @function addGame
     * @param {int} userID 
     * @param {int} score
     * @param {int} money
     * @returns {Promise<Void>} 
    */
    static async addGame(userID, score, money) {
        const insertSQL = 'INSERT INTO games (userid, topscore, topmoney) VALUES (?, ?, ?)';
        return await connection.query(insertSQL, [userID, score, money]);
    }

     /**
     * Fetches all the scores in order from the database.
     * 
     * @async
     * @function selectTopScores
     * @returns {Promise<Array<Games>>} 
    */
    static async selectTopScores() {
        const [games] = await connection.query(`
            SELECT g.gameid, g.userid, g.topscore, g.topmoney FROM games g
            INNER JOIN accounts a WHERE g.userid = a.userid
            ORDER BY g.topscore DESC`);
        return games;
    }
}

exports.Games = Games;
