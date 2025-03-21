const express = require('express');

const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);

require('dotenv').config();

const options = {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    //port : process.env.DB_PORT
};
const sessionStore = new mySQLStore(options);

exports.options = options;
exports.sessionStore = sessionStore;
