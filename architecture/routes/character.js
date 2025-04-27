const express = require('express');
const router = express.Router();
const character = require('../controllers/character');

// controllers
const characterController = require('../controllers/character.js');
const authController = require('../controllers/auth');

// GET requests
// public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/traits', characterController.getAllTraits);
router.get('/goodtraits', characterController.getOnlyGoodTraits);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);
router.get('/unlock/:characterId', character.checkCharacterUnlock);

// protected routes - require authentication
router.get('/unlocked-characters', authController.isAuthenticated, characterController.getUnlockedCharacters);


module.exports = router;