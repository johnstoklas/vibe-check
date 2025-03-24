const express = require('express');

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const connection = require('../../other/database').databaseConnection;
const logReturnEarly = require('../../other/utility').logReturnEarly;

/* Checks to make sure that the credentials that a user is logging in with are correct. */
async function checkCredentials(req, res) {

    const loginSQL = "SELECT userid, password FROM accounts WHERE username=?";
    const accounts = await connection.query(loginSQL, [req.body.username]);

    if(accounts[0].length == 0)
        return logReturnEarly("User not found.", '/', res);

    else if(accounts[0].length > 1) {
        console.assert(false, "Problem with MySQL database: duplicate entries found");
        return res.redirect('/');
    }
        
    const loginPassword = req.body.password;
    const storedHash = accounts[0][0].password;
    isEqual = await bcrypt.compare(loginPassword, storedHash);

    if(!isEqual)
        return logReturnEarly("Passwords is not correct.", '/', res);

    console.log("Successful log in!");

    req.session.isAuth = true;
    req.session.accountID = req.body.userid;
    res.redirect("/");
};

/* Registers a new user to the database, given that they provide the correct information. */
async function addNewUser(req, res) {

    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const users = await connection.query("SELECT userid, email, username FROM accounts");

    if(req.body.password !== req.body.password-repeat)
        return logReturnEarly("Passwords do not match.", '/', res);

    for(const user of users) {
        if(user[0].email === req.body.email)
            return logReturnEarly("Account with that email already exists.", '/', res);
        else if(user[0].username === req.body.username)
            return logReturnEarly("Username already taken.", '/', res);
    }

    const signupSQL = "INSERT INTO accounts (admin, email, username, password) VALUES (0, ?, ?, ?)"
    await connection.query(signupSQL, [req.body.email, req.body.username, hash]);

    console.log("Successful sign up!");

    req.session.isAuth = true;
    req.session.accountID = await connection.query("SELECT userid FROM accounts WHERE username=?", [req.body.username]);
    res.redirect("/");
};

module.exports = {checkCredentials, addNewUser};
