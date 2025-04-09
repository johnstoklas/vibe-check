const express = require('express');
const router = express.Router();

// TODO: I'm not sure if these two are necessary.
const expressWs = require('express-ws');
expressWs(router);

// controllers
const gameController = require('../controllers/game.js');

// GET requests through HTTP
router.get('/', gameController.startGame);

// WebSocket request
router.ws('/', gameController.playGame);

// exports
module.exports = router;
