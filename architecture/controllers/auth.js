const express = require('express');

const bcrypt = require('bcrypt');

const usersModel = require('../models/Users.js').Users;
const logReturnEarly = require('../../other/utility').logReturnEarly;

/* Checks to make sure that the credentials that a user is logging in with are correct. */
async function checkCredentials(req, res) {

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
        return logReturnEarly("Passwords is not correct.", '/', res);

    req.session.isAuth = true;
    req.session.accountID = users[0].userid;
    console.log("Successful log in!");

    res.redirect("/");
};

/* Registers a new user to the database, given that they provide the correct information. */
async function addNewUser(req, res) {

    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const users = await usersModel.selectAll();

    if(req.body.password !== req.body.password_repeat)
        return logReturnEarly("Passwords do not match.", '/', res);

    for(const user of users) {
        if(user.email === req.body.email)
            return logReturnEarly("Account with that email already exists.", '/', res);
        else if(user.username === req.body.username)
            return logReturnEarly("Username already taken.", '/', res);
    }

    const id = usersModel.insert(req.body.email, req.body.username, hash);

    console.log("Successful sign up!");

    req.session.isAuth = true;
    req.session.accountID = id;
    console.log("And successful log in!");

    res.redirect("/");
};

module.exports = {checkCredentials, addNewUser};
