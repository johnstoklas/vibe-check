const express = require('express');
const router = express.Router();

// controllers
const accountController = require('../controllers/account.js');

// GET requests
router.get('/', accountController.gatherAccountData);

// POST requests
router.post('/username-change', accountController.changeUsername);
router.post('/email-change', accountController.changeEmail);
router.post('/password-change', accountController.changePassword);
router.post('/logout', accountController.logOut);
router.post('/delete', accountController.deleteAccount);

// exports
module.exports = router;
