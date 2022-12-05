const express = require('express');
const trigger = require('../Core/newman.trigger')
const router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  const json = req.body;
  trigger(req.header('X-POSTMAN-KEY'), json)
      .then(() => res.json({Ok: true}))
      .catch((err) => res.json(err));
});

module.exports = router;
