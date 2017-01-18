var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('receipt/index', {title: 'GRN page'});
});

module.exports = router;
