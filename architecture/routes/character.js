const express = require('express');
const router = express.Router();
//Controllers
const characterController = require('../controllers/characterController');
const { isAuthenticated, isAdmin } = require('../architecture/controllers/auth');

// Public routes
router.get('/characters', characterController.getAllCharacters);
router.get('/traits', characterController.getAllTraits);
router.get('/characters/bytrait/:traitId', characterController.getCharactersByTrait);

// Protected routes - require authentication
router.get('/unlocked-characters', isAuthenticated, characterController.getUnlockedCharacters);
router.post('/unlock-character', isAuthenticated, characterController.unlockCharacter);

// Character trait management routes (admin only)
router.post('/characters/:characterId/traits/:traitId', isAdmin, characterController.addTraitToCharacter);
router.delete('/characters/:characterId/traits/:traitId', isAdmin, characterController.removeTraitFromCharacter);


// exports
module.exports = router;
