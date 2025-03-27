const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

/* Gets all unlocked characters. */
async function getUnlockedCharacters(req, res) {};

module.exports = {getUnlockedCharacters};
