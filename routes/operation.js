var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('operation/index', { title: 'Operation Page' });
});

module.exports = router;