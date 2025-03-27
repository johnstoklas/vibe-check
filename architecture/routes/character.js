const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { isAuthenticated, isAdmin } = require('../controllers/auth');

// Public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/traits', characterController.getAllTraits);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);

// Protected routes - require authentication
router.get('/unlocked-characters', isAuthenticated, characterController.getUnlockedCharacters);

// Admin only routes
router.post('/characters/:characterId/traits/:traitId', isAdmin, characterController.addTraitToCharacter);
router.delete('/characters/:characterId/traits/:traitId', isAdmin, characterController.removeTraitFromCharacter);

module.exports = router;