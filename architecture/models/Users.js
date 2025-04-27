const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Users
 * @description Handles SQL queries for user functions.
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

    static async deleteUser(userID) {
        return await connection.query('DELETE FROM accounts WHERE userid=?', [userID]);
    }
    
    /**
     * Fetches all users from the database.
     * 
     * @async
     * @function selectAll
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
     * @param {string} email
     * @returns {Promise<Account>} 
    */
    static async selectByEmail(email) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE email=?", [email]);
        return accounts;
    }

    static async selectByID(userID) {
        const [accounts] = await connection.query("SELECT * FROM accounts WHERE userid=?", [userID]);
        return accounts;
    }

    static async updateUsername(userID, username) {
        return await connection.query('UPDATE accounts SET username=? WHERE userid=?', [username, userID]);
    }

    static async updateEmail(userID, email) {
        return await connection.query('UPDATE accounts SET email=? WHERE userid=?', [email, userID]);
    }

    static async updatePassword(userID, hash) {
        return await connection.query('UPDATE accounts SET password=? WHERE userid=?', [hash, userID]);
    }
    
}

exports.Users = Users;
