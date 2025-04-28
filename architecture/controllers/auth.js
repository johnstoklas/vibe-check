const express = require('express');

const bcrypt = require('bcrypt');

// models and utility
const { Users : usersModel } = require('../models/Users.js');
const { UnlockedCharacters: unlockedCharactersModel } = require('../models/UnlockedCharacters.js')
const {fetchAlert, fetchRedirect, fetchAlertRedirect} = require('../utility.js');

const unlockConditions = require('../models/UnlockedCharacters.js')

/**
 * @module controllers/auth
 * @description Handles authentication logic including adding a new user, checking valid credentials, checking if they are authenticated, or if they are an admin.
 */

/**
 * @async
 * @function checkCredentials
 * @memberof module:controllers/auth
 * @description Checks to make sure that the credentials that a user is logging in with are correct.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function checkCredentials(req, res) {
    try {
        const users = await usersModel.selectByUsername(req.body.username);

        if(users.length == 0)
            return fetchAlert(req, res, "User not found.");

        else if(users.length > 1) {
            console.assert(false, "Problem with MySQL database: duplicate entries found");
            return res.redirect('/');
        }
        const loginPassword = req.body.password;
        const storedHash = users[0].password;
        isEqual = await bcrypt.compare(loginPassword, storedHash);

        if(!isEqual)
            return fetchAlert(req, res, "Password is not correct.");
        console.log("Successful sign up!");

        
        // stores all necessary user information in session
        req.session.isAuth = true;
        req.session.accountID = users[0].userid;
        req.session.username = users[0].username;
        req.session.isAdmin = users[0].admin === 1;

        return fetchRedirect(req, res, "Successful log in!");

    } catch (error) {
        console.error("Login error: ", error);
        return fetchAlert(req, res, "An error occurred during login.");
    }
};

/**
 * @async
 * @function addNewUser
 * @memberof module:controllers/auth
 * @description Registers a new user to the database, given that they provide the correct information.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @returns {Promise<Void>}
 */
async function addNewUser(req, res) {
    try {

        // checks that passwords match
        if(req.body.password !== req.body.password_repeat)
            return fetchAlert(req, res, "Passwords do not match.");

        // checks for existing email and username
        const emailUsers = await usersModel.selectByEmail(req.body.email);
        if(emailUsers.length > 0)
            return fetchAlertRedirect(req, res, "Account with that email already exists.");

        const usernameUsers = await usersModel.selectByUsername(req.body.username);
        if(usernameUsers.length > 0)
            return fetchAlert(req, res, "Username already taken.");

        // Create the user first
        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const insertInfo = await usersModel.addUser(req.body.email, req.body.username, hash);
        for(let i = 1; i <=8; i++)
            await unlockedCharactersModel.unlock(insertInfo.insertId, i);
        
        // Set up session
        req.session.isAuth = true;
        req.session.accountID = insertInfo.insertId;
        req.session.username = req.body.username;
        req.session.isAdmin = false;
      
        return fetchRedirect(req, res, "And successful log in!");

    } catch (error) {
        console.error("Registration error: ", error);
        return fetchAlert(req, res, "An error occurred during registration.");
    }
};

/**
 * @async
 * @function isAuthenticated
 * @memberof module:controllers/auth
 * @description Checks if the user is authenticated.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @param {function} next - The next middleware function in the Express stack.
 * @returns {Promise<Void>}
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuth && req.session.accountID)
        return next();
    res.status(401).json({ message: 'Authentication required' });
}

/**
 * @async
 * @function isAdmin
 * @memberof module:controllers/auth
 * @description Checks if the user is an admin.
 * @param {express.Request} req - The Express request object, expected to contain a session with `isAuth`.
 * @param {express.Response} res - The Express response object used to render the page or redirect.
 * @param {function} next - The next middleware function in the Express stack.
 * @returns {Promise<Void>}
*/
function isAdmin(req, res, next) {
    if (req.session && req.session.isAuth && req.session.isAdmin)
        return next();
    res.status(403).json({ message: 'Admin access required' });
}

module.exports = {
    checkCredentials,
    addNewUser,
    isAuthenticated,
    isAdmin
};

