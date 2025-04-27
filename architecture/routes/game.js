const express = require('express');
const router = express.Router();

/**
 * @module routes/game
 */

// controllers
const gameController = require('../controllers/game.js');

// GET requests through HTTP
/**
 * GET
 * 
 * On load of game page, we call startGame in the game controller.
 *
 * @name gamePageRoute
 * @function
 * @memberof module:routes/game
 */
router.get('/', gameController.startGame);

// WebSocket request
/**
 * WebSocket
 * 
 * On load of game page, we open a web socket that handles user inputs from the frontend.
 *
 * @name webSocketConnection
 * @function
 * @memberof module:routes/game
 */
router.ws('/', gameController.playGame);

// exports
module.exports = router;
