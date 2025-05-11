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
    * Deletes a game from the database (used by admin).
    * 
    * @async
    * @function deleteGame
    * @param {int} gameID 
    * @returns {Promise<Void>} 
   */
    static async removeGame(gameID) {
        const deleteSQL = 'DELETE FROM games WHERE gameid = ?';
        return await connection.query(deleteSQL, [gameID]);
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
            SELECT g.gameid, g.userid, g.topscore, g.topmoney, a.username FROM games g
            INNER JOIN accounts a ON g.userid = a.userid
            ORDER BY g.topscore DESC`);
        return games;
    }

    /**
     * Fetches the scores and topmoney for a specific user.
     * 
     * @async
     * @function selectUserScore
     * @param {int} userID
     * @returns {Promise<Array<Games>>}
    */
    static async selectUserScore(userID) {
        const [games] = await connection.query(`
            SELECT topscore, topmoney
            FROM games 
            WHERE userid = ?
            ORDER BY topscore DESC 
            LIMIT 1`, [userID]);
        return games;
    }

    /**
     * Fetches all the money in order from the database.
     * 
     * @async
     * @function selectTopMoney
     * @returns {Promise<Array<Games>>} 
    */
    static async selectTopMoney() {
        const [games] = await connection.query(`
            SELECT g.gameid, g.userid, g.topscore, g.topmoney, a.username FROM games g
            INNER JOIN accounts a ON g.userid = a.userid
            ORDER BY g.topmoney DESC`);
        return games;
    }

    /**
     * Fetches how many games a user has played
     * 
     * @async
     * @function checkGamesPlayed
     * @returns {Promise<Int>} 
    */
    static async checkGamesPlayed(userID) {
        const [rows] = await connection.query(
            'SELECT COUNT(*) as gameCount FROM games WHERE userid = ?',
            [userID]
        );
        return rows[0].gameCount;
    }
}

module.exports = { Games };
