const express = require('express');

const bcrypt = require('bcrypt');

// utility
const {alertRedirect, noAlertRedirect} = require('../utility');

/* Gathers account data. */
async function gatherAccountData(req, res) {
    res.render('pages/account');
};

/* Logs out of the user's account. */
async function logOut(req, res) {
    req.session.isAuth = false;
    noAlertRedirect(req, res, 'Successful log out.')
}

module.exports = {gatherAccountData, logOut};
