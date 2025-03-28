const express = require('express');

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const connection = require('../../other/database').databaseConnection;

const usersModel = require('../models/Users.js').Users;
const logReturnEarly = require('../../other/utility').logReturnEarly;

/* Checks to make sure that the credentials that a user is logging in with are correct. */
async function checkCredentials(req, res) {

    try {
        const users = await usersModel.selectByUsername(req.body.username);

        if(users.length == 0)
            return logReturnEarly("User not found.", '/', res);

        else if(users.length > 1) {
            console.assert(false, "Problem with MySQL database: duplicate entries found");
            return res.redirect('/');
        }
            
        const loginPassword = req.body.password;
        const storedHash = users[0].password;
        isEqual = await bcrypt.compare(loginPassword, storedHash);

        if(!isEqual)
            return logReturnEarly("Password is not correct.", '/', res);

        // stores all necessary user information in session
        req.session.isAuth = true;
        req.session.accountID = users[0].userid;
        req.session.username = users[0].username;
        req.session.isAdmin = users[0].admin === 1;

        console.log("Successful log in!");
        res.redirect("/");

    } catch (error) {
        console.error("Login error: ", error);
        return logReturnEarly("An error occurred during login.", '/', res);
    }
};

/* Registers a new user to the database, given that they provide the correct information. */
async function addNewUser(req, res) {

    try {
        // checks that passwords match
        if(req.body.password !== req.body.password_repeat)
            return logReturnEarly("Passwords do not match.", '/', res);

        // checks for existing email and username
        const [emailUsers] = await connection.query("SELECT userid FROM accounts WHERE email = ?", [req.body.email]);
        if(emailUsers.length > 0)
            return logReturnEarly("Account with that email already exists.", '/', res);

        const [usernameUsers] = await connection.query("SELECT userid FROM accounts WHERE username = ?", [req.body.username]);
        if(usernameUsers.length > 0)
            return logReturnEarly("Username already taken.", '/', res);

        // inserts new user with new game record and first unlockable character, assuming it starts at 1
        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.password, saltRounds);

        const insertInfo = await usersModel.insert(req.body.email, req.body.username, hash);
        await connection.query("INSERT INTO games (userid, topscore, topmoney) VALUES (?, 0, 0)", [insertInfo.insertId]);
        await connection.query("INSERT INTO unlocked_characters (userid, characterid) VALUES (?, 1)", [insertInfo.insertId]);

        console.log("Successful sign up!");

        // sets session data
        req.session.isAuth = true;
        req.session.accountID = insertInfo.insertId;
        req.session.username = req.body.username;
        req.session.isAdmin = false;
        
        console.log("And successful log in!");
        res.redirect("/");

    } catch (error) {
        console.error("Registration error: ", error);
        return logReturnEarly("An error occurred during registration.", '/', res);
    }
};

/* Checks if a user is authenticated. */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuth && req.session.accountID)
        return next();
    res.status(401).json({ message: 'Authentication required' });
}

/* Checks if user is an admin. */
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
