const express = require('express');

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const connection = require('../../other/database').databaseConnection;
const logReturnEarly = require('../../other/utility').logReturnEarly;

/* Checks to make sure that the credentials that a user is logging in with are correct. */
async function checkCredentials(req, res) {
    try {
        const loginSQL = "SELECT userid, username, password, admin FROM accounts WHERE username=?";
        const [accounts] = await connection.query(loginSQL, [req.body.username]);

        if(accounts.length === 0) {
            return logReturnEarly("User not found.", '/', res);
        }

        else if(accounts.length > 1) {
            console.assert(false, "Problem with MySQL database: duplicate entries found");
            return res.redirect('/');
        }
            
        const loginPassword = req.body.password;
        const account = accounts[0];
        const isEqual = await bcrypt.compare(loginPassword, account.password);

        if(!isEqual) {
            return logReturnEarly("Password is not correct.", '/', res);
        }

        console.log("Successful log in!");

        // Store all necessary user information in session
        req.session.isAuth = true;
        req.session.accountID = account.userid; // Fixed: was using req.body.userid before
        req.session.username = account.username;
        req.session.isAdmin = account.admin === 1;
        
        res.redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        return logReturnEarly("An error occurred during login.", '/', res);
    }
}


/* Registers a new user to the database, given that they provide the correct information. */
async function addNewUser(req, res) {
    try {
        if(req.body.password !== req.body.password_repeat) { // Fixed: changed hyphen to underscore to match form
            return logReturnEarly("Passwords do not match.", '/', res);
        }

        // Check for existing email and username
        const [existingUsers] = await connection.query(
            "SELECT userid FROM accounts WHERE email = ? OR username = ?",
            [req.body.email, req.body.username]
        );

        if(existingUsers.length > 0) {
            return logReturnEarly("Username or email already exists.", '/', res);
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.password, saltRounds);

        // Insert new user
        const signupSQL = "INSERT INTO accounts (admin, email, username, password) VALUES (0, ?, ?, ?)";
        const [result] = await connection.query(signupSQL, [req.body.email, req.body.username, hash]);

        console.log("Successful sign up!");

        // Set session data
        req.session.isAuth = true;
        req.session.accountID = result.insertId;
        req.session.username = req.body.username;
        req.session.isAdmin = false;

        // Initialize games record for new user
        await connection.query(
            "INSERT INTO games (userid, topscore, topmoney) VALUES (?, 0, 0)",
            [result.insertId]
        );

        // Unlock first character for new user (assuming character 1 is the starter character)
        await connection.query(
            "INSERT INTO unlocked_characters (userid, characterid) VALUES (?, 1)",
            [result.insertId]
        );

        res.redirect("/");
    } catch (error) {
        console.error("Registration error:", error);
        return logReturnEarly("An error occurred during registration.", '/', res);
    }
}

/* Middleware to check if user is authenticated */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuth && req.session.accountID) {
        return next();
    }
    res.status(401).json({ message: 'Authentication required' });
}

/* Middleware to check if user is admin */
function isAdmin(req, res, next) {
    if (req.session && req.session.isAuth && req.session.isAdmin) {
        return next();
    }
    res.status(403).json({ message: 'Admin access required' });
}

module.exports = {
    checkCredentials,
    addNewUser,
    isAuthenticated,
    isAdmin
};
