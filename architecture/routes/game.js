const express = require('express');
const router = express.Router();

// controllers

// GET requests
// public routes
router.get('/', (req, res) => {
    res.render('pages/game');
});

// protected routes - require authentication

// exports
module.exports = router;