const express = require('express');
const router = express.Router();

// controllers
const accountController = require('../controllers/account.js');

// GET requests
router.get('/', accountController.gatherAccountData);

// POST requests
router.post('/logout', accountController.logOut)

// exports
module.exports = router;
