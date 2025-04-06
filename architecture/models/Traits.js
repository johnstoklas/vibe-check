const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Traits {
    
    static async selectAllOrdered() {
        const [traits] = await connection.query('SELECT * FROM traits ORDER BY trait_name');
        return traits;
    }
}

exports.Traits = Traits;