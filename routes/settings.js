const express = require('express');
const settings = require('../Core/settings')
const router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    const json = req.body;
    settings.set(json.userStory);
    res.status(200);
});

module.exports = router;
