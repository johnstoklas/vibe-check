const express = require('express');
const router = express.Router();

const connection = require('../database/connection').databaseConnection;
const bcrypt = require('bcrypt');

/* GET login page. */
router.get('/', async (req, res) => {

    const emailUserSQL = "SELECT email, username FROM accounts";
    connection.query(emailUserSQL, (err1, users) => {
        if(err1) throw err1;
        res.render('pages/auth', { title: 'Auth', users });
    });

});

/* POST login on auth page. */
router.post('/login', async (req, res) => {

    const loginSQL = "SELECT email, password FROM accounts WHERE username=?";
    connection.query(loginSQL, [req.body.username], (err1, result) => {

        if(err1) throw err1;

        else if(result.length == 0)
            console.log("User not found.");

        else if(result.length == 1) {

            const loginPassword = req.body.password;
            const storedHash = result[0].password;

            bcrypt.compare(loginPassword, storedHash, (err2, result) => {

                if (err2) throw err2;
                else if(result)
                    res.redirect("/");
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

    bcrypt.hash(req.body.password, saltRounds, (err1, hash) => {

        if (err1) throw err1;

        const signupSQL = "INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)"
        connection.query(signupSQL, [req.body.email, req.body.username, hash], (err2, result) => {
            if(err2) throw err2;
            res.redirect("/");
        });
    });

});

module.exports = router;
