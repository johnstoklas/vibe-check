const express = require('express');

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const connection = require('../../other/database').databaseConnection;

/* Gathers account data. */
async function gatherAccountData(req, res) {};

module.exports = {gatherAccountData};
