const express = require('express');

const bcrypt = require('bcrypt');

// models and utility
const usersModel = require('../models/Users').Users;
const {fetchAlert, fetchRedirect, fetchAlertRedirect } = require('../utility');

/**
 * @module controllers/account
 * @description Handles the logic for users wanting to change info about their account and gathering account info whenn the account page is clicked.
 */

/**
 * @async
 * @function gatherAccountData
 * @memberof module:controllers/account
 * @description Gathers the account data for a user.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function gatherAccountData(req, res) {

    try {
        if(!req.session.isAuth)
            return fetchAlertRedirect(req, res, "Authentication is required to access the account page.");

        users = await usersModel.selectByID(req.session.accountID);
        if(users.length > 1) {
            console.assert(false, "Problem with MySQL database: duplicate entries found");
            return res.redirect('/');
        }

        res.render('pages/account', {username: users[0].username, email: users[0].email});

    } catch (error) {
        console.error("Account error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to gather account data.");
    }
};

/**
 * @async
 * @function changeUsername
 * @memberof module:controllers/account
 * @description When a user tries to change their username, this functions calls the SQL query to update the username in the database.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function changeUsername(req, res) {

    try {
        // checks for existing username
        const usernameUsers = await usersModel.selectByUsername(req.body.username);
        if(usernameUsers.length > 0)
            return fetchAlertRedirect(req, res, "Username already taken.");

        // changes the username to the new username
        const newUsername = req.body.username;
        await usersModel.updateUsername(users[0].userid, newUsername);

        fetchRedirect(req, res, 'Successful change username.', '/account');

    } catch (error) {
        console.error("Change username error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to change the username.");
    }
}

/**
 * @async
 * @function changeEmail
 * @memberof module:controllers/account
 * @description When a user tries to change their email, this functions calls the SQL query to update the username in the database.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function changeEmail(req, res) {

    try {
        // checks for existing email
        const emailUsers = await usersModel.selectByEmail(req.body.email);
        if(emailUsers.length > 0)
            return fetchAlertRedirect(req, res, "Account with that email already exists.");

        // changes the username to the new username
        const newEmail = req.body.email;
        await usersModel.updateEmail(users[0].userid, newEmail);

        fetchRedirect(req, res, 'Successful change email.');

    } catch (error) {
        console.error("Change email error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to change the email.");
    }
}

/**
 * @async
 * @function changePassword
 * @memberof module:controllers/account
 * @description When a user tries to change their password, this functions calls the SQL query to update the username in the database.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function changePassword(req, res) {

    try {

        // checks that new passwords match
        if(req.body.password_new !== req.body.password_new_repeat)
            return fetchAlertRedirect(req, res, "New passwords do not match.");

        // grabs the user information and checks that the old password matches the password in the database
        users = await usersModel.selectByID(req.session.accountID);

        const oldPassword = req.body.password_old;
        const storedHash = users[0].password;

        isEqual = await bcrypt.compare(oldPassword, storedHash);
        if(!isEqual)
            return fetchAlertRedirect(req, res, "Old password does not match.");

        // hashes and salts the new password and updates it
        const newPassword = req.body.password_new;

        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);

        await usersModel.updatePassword(users[0].userid, hash);
        fetchRedirect(req, res, 'Successful change password.');

    } catch (error) {
        console.error("Change password error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to change the password.");
    }
}

/**
 * @async
 * @function logOut
 * @memberof module:controllers/account
 * @description Logs the user out of their session and then redirects them to the home page.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function logOut(req, res) {

    try {

        // resets session data
        req.session.isAuth = false;

        req.session.accountID = undefined;
        req.session.username = undefined;
        req.session.isAdmin = undefined;

        fetchRedirect(req, res, 'Successful log out.');

    } catch (error) {
        console.error("Logout error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to log out.");
    }
}

/**
 * @async
 * @function deleteAccount
 * @memberof module:controllers/account
 * @description If the user requests their account be deleted, we send a SQL query to update the database accordingly.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function deleteAccount(req, res) {

    try {
        
        // resets some session data
        req.session.isAuth = false;

        req.session.username = undefined;
        req.session.isAdmin = undefined;

        // deletes user and finishes resetting session data
        usersModel.deleteUser(req.session.accountID);
        req.session.accountID = undefined;

        fetchRedirect(req, res, 'Successful deleting of account.');

    } catch (error) {
        console.error("Delete account error: ", error);
        return fetchAlertRedirect(req, res, "An error occurred while trying to delete account.");
    }
}

module.exports = {
    gatherAccountData,
    changeUsername,
    changeEmail,
    changePassword,
    logOut,
    deleteAccount
};
