const express = require('express');
const router = express.Router();

const connection = require('../database/connection').databaseConnection;
const bcrypt = require('bcrypt');

/* GET login page. */
router.get('/', async (req, res) => {

    const emailUserSQL = "SELECT email, username FROM accounts";
    connection.query(emailUserSQL, (err, users) => {
        if(err) throw err;
        res.render('pages/auth', { title: 'Auth', users });
    });

});

/* POST login on auth page. */
router.post('/login', async (req, res) => {

    const loginSQL = "SELECT account_id, account_password FROM accounts WHERE account_username=?";
    connection.query(loginSQL, [req.body.username], (err1, result) => {

        if(err1) throw err1;

        else if(result.length == 0)
            console.log("User not found.");

        else if(result.length == 1) {

            const loginPassword = req.body.password;
            const storedHash = result[0].account_password;

            bcrypt.compare(loginPassword, storedHash, (err2, equal) => {
                if(err2) throw err2;
                else if(equal) {
                    res.redirect("/"); // TODO: add logic to actually sign in to your account
                }
                else
                    console.log('Passwords do not match.');
            });
        }

        else
            throw new Error("problem found with the API or SQL: duplicate entries found");
    });

});

/* POST signup on auth page. */
router.post('/signup', async (req, res) => {

    const signupPassword = req.body.password;
    const saltRounds = 10;

    bcrypt.hash(signupPassword, saltRounds, (err1, hash) => {

        if(err1) throw err1;

        const signupSQL = "INSERT INTO accounts (account_email, account_username, account_password) VALUES (?, ?, ?)"
        connection.query(signupSQL, [req.body.email, req.body.username, hash], (err2, result) => {
            if(err2) throw err2;
            res.redirect("/"); // TODO: add logic to actually sign in to your account
        });
    });

});

module.exports = router;
