const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class Traits {
    
    static async selectAllOrdered() {
        const [traits] = await connection.query('SELECT * FROM traits ORDER BY id ASC');
        return traits;
    }

    static async getgoodTrait(traitID) {
        const [traits] = await connection.query('SELECT * FROM traits WHERE goodtrait = 1', [traitID]);
        return traits[0].goodtrait;
    }
}

exports.Traits = Traits;