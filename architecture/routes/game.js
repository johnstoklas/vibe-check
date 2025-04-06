const express = require('express');
const router = express.Router();

// controllers
const gameController = require('../controllers/game.js');

// GET requests
router.get('/', (req, res) => {
    res.render('pages/game');
});

// exports
module.exports = router;
