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

exports.databaseConnection = mysql.createPool(options);
exports.sessionStore = new mySQLStore(options);
