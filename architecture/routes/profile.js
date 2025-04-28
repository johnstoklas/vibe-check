const express = require('express');
const router = express.Router();

/**
 * @module routes/profile
 * @description Handles routing for profile functionality.
 */

// controllers
const accountController = require('../controllers/account.js');
const authController = require('../controllers/auth.js')

// GET requests
router.get('/', accountController.gatherAccountData);

// POST requests

/**
 * POST
 * 
 * Router for changing the username of an account.
 *
 * @name usernameChange
 * @function
 * @memberof module:routes/profile
 */
router.post('/username-change', accountController.changeUsername);

/**
 * POST
 * 
 * Router for change the email of an account.
 *
 * @name emailChange
 * @function
 * @memberof module:routes/profile
 */
router.post('/email-change', accountController.changeEmail);

/**
 * POST
 * 
 * Router for changing the password of an account.
 *
 * @name passwordChange
 * @function
 * @memberof module:routes/profile
 */
router.post('/password-change', accountController.changePassword);

/**
 * POST
 * 
 * Router for logging out of an account.
 *
 * @name logout
 * @function
 * @memberof module:routes/profile
 */
router.post('/logout', accountController.logOut);

/**
 * POST
 * 
 * Router for deleting an account.
 *
 * @name delete
 * @function
 * @memberof module:routes/profile
 */
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
