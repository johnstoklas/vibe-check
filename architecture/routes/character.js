const express = require('express');
const router = express.Router();

/**
 * @module routes/character
 */

// controllers
const characterController = require('../controllers/character.js');
const authController = require('../controllers/auth');

// GET requests
// public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/traits', characterController.getAllTraits);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);

// protected routes - require authentication
/**
 * GET
 * 
 * On load of characters page, we ensure the user is authenticated, then call getUnlockedCharacters in the controller.
 *
 * @name charactersPageRoute
 * @function
 * @memberof module:routes/character
 */
router.get('/unlocked-characters', authController.isAuthenticated, characterController.getUnlockedCharacters);

// exports
module.exports = router;