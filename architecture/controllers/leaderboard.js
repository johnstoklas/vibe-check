const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

/* Get high scores of users. */
async function getHighScores(req, res) {};

module.exports = {getHighScores};
