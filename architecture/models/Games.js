const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Games {

    static async addGame(userID, score, money) {
        const insertSQL = 'INSERT INTO games (userid, topscore, topmoney) VALUES (?, ?, ?)';
        return await connection.query(insertSQL, [userID, score, money]);
    }
}

exports.Games = Games;
