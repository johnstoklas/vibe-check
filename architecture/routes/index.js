const express = require('express');
const router = express.Router();

/**
 * @module routes/index
 * @description Handles routing for the main page and instruction page.
 */

// controllers
const authController = require('../controllers/auth.js');

// GET requests
/**
 * GET
 * 
 * Renders the main page of the application using the 'main' EJS template.
 *
 * @name mainPageRoute
 * @function
 * @memberof module:routes/index
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.get('/', (req, res) => {
    res.render('pages/main', {isAuth: req.session.isAuth});
});

/**
 * GET
 * 
 * Renders the instructions page of the application using the 'instruction' EJS template.
 *
 * @name instructionsPageRoute
 * @function
 * @memberof module:routes/index
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.get('/instructions', (req, res) => {
    res.render('pages/instructions');
});

// POST requests
/**
 * POST
 * 
 * Reroutes to auth controller for login functionality.
 *
 * @name loginRoute
 * @function
 * @memberof module:routes/index
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.post('/login', authController.checkCredentials);

/**
 * POST
 * 
 * Reroutes to auth controller for sign up functionality.
 *
 * @name signUpRoute
 * @function
 * @memberof module:routes/index
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.post('/signup', authController.addNewUser);

// exports
module.exports = router;
