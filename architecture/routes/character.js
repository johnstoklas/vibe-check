const express = require('express');
const router = express.Router();
const character = require('../controllers/character');

/**
 * @module routes/character
 * @description Handles routing for character page.
 */

// controllers
const characterController = require('../controllers/character.js');
const authController = require('../controllers/auth');

// GET requests
// public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);
router.get('/unlock/:characterId', character.checkCharacterUnlock);

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


module.exports = router;