const express = require('express');
const router = express.Router();

// controllers
const authController = require('../controllers/auth.js');
const accountController = require('../controllers/account.js');

// GET requests
// TODO: router.get('/account', accountController.gatherAccountData);

// POST requests
router.post('/login', authController.checkCredentials);
router.post('/signup', authController.addNewUser);

// exports
module.exports = router;
