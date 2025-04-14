const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Games {

    static async addGame(userID, score, money) {
        const insertSQL = 'INSERT INTO games (userid, topscore, topmoney) VALUES (?, ?, ?)';
        return await connection.query(insertSQL, [userID, score, money]);
    }

    static async selectTopScores() {
        const [games] = await connection.query(`
            SELECT g.gameid, g.userid, g.topscore, g.topmoney FROM games g
            INNER JOIN accounts a WHERE g.userid = a.userid
            ORDER BY g.topscore DESC`);
        return games;
    }
}

exports.Games = Games;
