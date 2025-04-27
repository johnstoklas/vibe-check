const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Users {

    static async addUser(email, username, hash) {

        const insertSQL = "INSERT INTO accounts (admin, email, username, password) VALUES (0, ?, ?, ?)"
        const [info] = await connection.query(insertSQL, [email, username, hash]);

        await connection.query("INSERT INTO games (userid, topscore, topmoney) VALUES (?, 0, 0)", [info.insertId]);
        await connection.query("INSERT INTO unlocked_characters (userid, characterid) VALUES (?, 1)", [info.insertId]);

        return info;
    }
    
    static async selectAll() {
        const [accounts] = await connection.query("SELECT * FROM accounts");
        return accounts;
    }

    static async selectByUsername(username) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE username=?", [username]);
        return accounts;
    }

    static async selectByEmail(email) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE email = ?", [email]);
        return accounts;
    }
}

module.exports = { Users };
