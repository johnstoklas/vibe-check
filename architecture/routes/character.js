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
/**
 * GET
 * 
 * Routing for getting all characters.
 *
 * @name allCharactersRoute
 * @function
 * @memberof module:routes/character
 */
router.get('/characters', characterController.getAllCharacters);

/**
 * GET
 * 
 * Routing for getting characters by a trait.
 *
 * @name allCharactersByTraitRoute
 * @function
 * @memberof module:routes/character
 */
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);

/**
 * GET
 * 
 * Routing for checking if a character is unlocked.
 *
 * @name checkingCharacterUnlocked
 * @function
 * @memberof module:routes/character
 */
router.get('/unlock/:characterId', characterController.checkCharacterUnlock);

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
router.get('/', authController.isAuthenticated, characterController.getUnlockedCharacters);


module.exports = router;