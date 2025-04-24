const express = require('express');
const router = express.Router();

/**
 * @module routes/index
 */

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
    res.render('pages/main');
});

/* TODO: router.get('/instructions', (req, res) => {
    res.render('pages/instructions');
});*/

// exports
module.exports = router;
