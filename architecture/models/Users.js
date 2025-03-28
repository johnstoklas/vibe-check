const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

class Users {

    static async insert(email, username, hash) {
        const insertSQL = "INSERT INTO accounts (admin, email, username, password) VALUES (0, ?, ?, ?)"
        const [info] = await connection.query(insertSQL, [email, username, hash]);
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
}

exports.Users = Users;
