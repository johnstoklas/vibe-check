const express = require('express');
const router = express.Router();

const expressWs = require('express-ws');
expressWs(router);

// controllers
const gameController = require('../controllers/game.js');

// GET requests through HTTP
router.get('/', gameController.startGame);

// requests through Web Sockets
router.ws('/', gameController.playGame);

// exports
module.exports = router;
