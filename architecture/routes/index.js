const express = require('express');
const router = express.Router();

// controllers
const authController = require('../controllers/auth.js');

// GET requests
router.get('/', (req, res) => {
    res.render('pages/main', {isAuth: req.session.isAuth});
});
/* TODO: router.get('/instructions', (req, res) => {
    res.render('pages/instructions');
});*/

// POST requests
router.post('/login', authController.checkCredentials);
router.post('/signup', authController.addNewUser);

// exports
module.exports = router;
