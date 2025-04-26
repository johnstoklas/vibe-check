const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Users
 */

/**
 * @typedef {Object} Account
 * @property {int} userid 
 * @property {int} admin
 * @property {string} username
 * @property {string} password
 * @property {string} email
 */
class Users {

    /**
     * Adds a user to the database with an email, username, and hashed password.
     * 
     * @async
     * @function addUser
     * @memberof models/Users
     * @param {string} email
     * @param {string} username
     * @param {string} hash
     * @returns {Promise<Account>} 
    */
    static async addUser(email, username, hash) {

        const insertSQL = "INSERT INTO accounts (admin, email, username, password) VALUES (0, ?, ?, ?)"
        const [info] = await connection.query(insertSQL, [email, username, hash]);

        await connection.query("INSERT INTO games (userid, topscore, topmoney) VALUES (?, 0, 0)", [info.insertId]);
        await connection.query("INSERT INTO unlocked_characters (userid, characterid) VALUES (?, 1)", [info.insertId]);

        return info;
    }

    /**
     * Fetches all users from the database.
     * 
     * @async
     * @function selectAll
     * @memberof models/Users
     * @returns {Promise<Array<Account>>} 
    */
    static async selectAll() {
        const [accounts] = await connection.query("SELECT * FROM accounts");
        return accounts;
    }
    
    /**
     * Fetches user with specific username.
     * 
     * @async
     * @function selectByUsername
     * @memberof models/Users
     * @param {string} username
     * @returns {Promise<Account>} 
    */
    static async selectByUsername(username) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE username=?", [username]);
        return accounts;
    }

    /**
     * Fetches user with specific email.
     * 
     * @async
     * @function selectByEmail
     * @memberof models/Users
     * @param {string} email
     * @returns {Promise<Account>} 
    */
    static async selectByEmail(email) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE email = ?", [email]);
        return accounts;
    }
}

exports.Users = Users;
