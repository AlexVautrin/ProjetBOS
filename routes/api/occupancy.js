// routes/api/occupancy.js

const express = require('express');
const router = express.Router();

// @route GET api/occupancy
// @desc Get occupancy data
// @access Public
router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;
