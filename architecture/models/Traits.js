const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

/**
 * @module models/Traits
 * @description Handles SQL queries for traits.
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
        const [traits] = await connection.query('SELECT * FROM traits ORDER BY id ASC');
        return traits;
    }

    static async getgoodTrait(traitID) {
        const [traits] = await connection.query('SELECT * FROM traits WHERE goodtrait = 1', [traitID]);
        return traits[0].goodtrait;
    }
}

module.exports = Traits;