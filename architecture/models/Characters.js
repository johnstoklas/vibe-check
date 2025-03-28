const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

class Characters {

    static async selectAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM characters', (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static async selectById(characterid) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM characters WHERE characterid=?', [characterid], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        });
    }

}

exports.Characters = Characters;
