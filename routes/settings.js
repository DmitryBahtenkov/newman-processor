const express = require('express');
const settings = require('../Core/settings')
const router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    const json = req.body;
    settings.set(json.userStory, (x) => {
        res.json({ok: x});
    });
});

router.get('/', function(req, res, next) {
    res.json(settings.read());
});

module.exports = router;
