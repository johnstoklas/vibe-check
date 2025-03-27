const express = require('express');

const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

/* Sends the score. */
async function sendScore(req, res) {};

module.exports = {sendScore};
