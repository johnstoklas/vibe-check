const express = require('express');
const router = express.Router();

/**
 * @module routes/profile
 */

// controllers
const authController = require('../controllers/auth.js');
const accountController = require('../controllers/account.js');

// GET requests
// TODO: router.get('/account', accountController.gatherAccountData);

// POST requests
/**
 * POST
 * 
 * On succesful login, we create a session using express sessions for a user.
 *
 * @name login
 * @function
 * @memberof module:routes/profile
 */
router.post('/login', authController.checkCredentials);
/**
 * POST
 * 
 * On succesful signup, we create an account, log the user in, and we create a session using express sessions for a user.
 *
 * @name signup
 * @function
 * @memberof module:routes/profile
 */
router.post('/signup', authController.addNewUser);

// exports
module.exports = router;
