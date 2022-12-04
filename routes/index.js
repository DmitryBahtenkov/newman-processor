const express = require('express');
const trigger = require('../Core/newman.trigger')
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  trigger(req.header('X-POSTMAN-KEY'), req.query.filter)
      .then(() => res.json({Ok: true}))
      .catch((err) => res.json(err));
});

module.exports = router;
