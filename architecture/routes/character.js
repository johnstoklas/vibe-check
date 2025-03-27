const express = require('express');
const router = express.Router();

// controllers
const characterController = require('../controllers/character.js');

// GET requests
// TODO: router.get('/getCharacters', characterController.getUnlockedCharacters);

// exports
module.exports = router;
