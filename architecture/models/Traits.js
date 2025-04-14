const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

class Traits {
    
    static async selectAllOrdered() {
        const [traits] = await connection.query('SELECT * FROM traits WHERE goodtrait = 1 ORDER BY id ASC');
        return traits;
    }
}

exports.Traits = Traits;