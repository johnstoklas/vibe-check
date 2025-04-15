const express = require('express');
const router = express.Router();

// controllers
const characterController = require('../controllers/character.js');
const authController = require('../controllers/auth');

// GET requests
// public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/traits', characterController.getAllTraits);
router.get('/goodtraits', characterController.getOnlyGoodTraits);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);

// protected routes - require authentication
router.get('/unlocked-characters', authController.isAuthenticated, characterController.getUnlockedCharacters);

// exports
module.exports = router;