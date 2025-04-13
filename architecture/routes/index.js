const express = require('express');
const router = express.Router();

// GET requests
router.get('/', (req, res) => {
    res.render('pages/main');
});

/* TODO: router.get('/instructions', (req, res) => {
    res.render('pages/instructions');
});*/

// exports
module.exports = router;
