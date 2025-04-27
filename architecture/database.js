/**
 * @module config/database
 * @description Sets up the MySQL database connection and session store
 */

const express = require('express');

const mysql = require('mysql2/promise');
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);

require('dotenv').config();

const options = {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
};

/**
 * @constant {mysql.Pool} databaseConnection
 * @description A MySQL connection pool for database queries
 */
exports.databaseConnection = mysql.createPool(options);

/**
 * @constant {mySQLStore} sessionStore
 * @description A session store backed by MySQL for Express sessions
 */
exports.sessionStore = new mySQLStore(options);
