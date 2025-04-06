const express = require('express');
const router = express.Router();

// controllers
const gameController = require('../controllers/game.js');

// other fields
const Game = gameController.Game
var game;

// GET requests
router.get('/', async (req, res) => {

    if(!req.session.isGameRunning)
        game = await Game.init(req, res);

    res.render('pages/game', {game: game});
});

// exports
module.exports = router;
