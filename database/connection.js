const express = require('express');

const mysql = require('mysql2');
require('dotenv').config();

var database = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT
});

database.connect((err => {
    if(err) throw err;
    console.log('MySQL Connected');
}));

exports.databaseConnection = database;
