const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Traits
 */

/**
 * @typedef {Object} Trait
 * @property {int} id
 * @property {string} trait_name
 * @property {int} goodtrait
 */

class Traits {
    /**
     * Selects all possible traits from the database in order.
     * 
     * @async
     * @function selectAllOrdered
     * @returns {Promise<Array<Traits>>} 
    */
    static async selectAllOrdered() {
        const [traits] = await connection.query('SELECT * FROM traits ORDER BY trait_name');
        return traits;
    }
}

module.exports = Traits;