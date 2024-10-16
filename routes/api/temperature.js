// routes/api/temperature.js

const express = require('express');
const router = express.Router();

// @route GET api/temperature
// @desc Get temperature data
// @access Public
router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;
