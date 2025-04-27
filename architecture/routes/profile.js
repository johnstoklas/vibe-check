const express = require('express');
const router = express.Router();

/**
 * @module routes/profile
 */

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
