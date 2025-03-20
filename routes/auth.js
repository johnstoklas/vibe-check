const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const options = require('../connection/database').options;

/* GET login page. */
router.get('/', async (req, res) => {
    res.render('pages/auth', { title: 'Auth' });
});

/* POST login on auth page. */
router.post('/login', async (req, res) => {

    const connection = await mysql.createConnection(options);

    const loginSQL = "SELECT account_id, account_password FROM accounts WHERE account_username=?";
    const accounts = await connection.query(loginSQL, [req.body.username]);

    if(accounts.length == 0) {
        console.log("User not found.");
        res.redirect('../');
        return await connection.close();
    }

    else if(accounts.length != 1)
        throw new Error("problem with MySQL database: duplicate entries found");
        
    const loginPassword = req.body.password;
    const storedHash = accounts[0].account_password;
    isEqual = await bcrypt.compare(loginPassword, storedHash);

    if(!isEqual) {
        console.log('Passwords do not match.');
        res.redirect('../');
        return await connection.close();
    }

    req.session.isAuth = true;
    req.session.accountID = req.body.account_id;
    res.redirect("/");

    await connection.close();
});

/* POST signup on auth page. */
router.post('/signup', async (req, res) => {

    const connection = await mysql.createConnection(options);

    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const users = await connection.query("SELECT account_id, account_email, account_username FROM accounts");

    for(const user of users) {
        if(user.account_email === req.body.email) {
            console.log("Account with that email already exists.");
            res.redirect('../');
            return await connection.close();
        }
        else if(user.account_username === req.body.username) {
            console.log("Username already taken.");
            res.redirect('../');
            return await connection.close();
        }
    }

    const signupSQL = "INSERT INTO accounts (account_email, account_username, account_password) VALUES (?, ?, ?)"
    await connection.query(signupSQL, [req.body.email, req.body.username, hash]);

    req.session.isAuth = true;
    req.session.accountID = await connection.query("SELECT account_id FROM accounts WHERE account_username=?", [req.body.username]);
    res.redirect("/");

    await connection.close();
});

module.exports = router;
