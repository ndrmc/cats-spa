var express = require('express');
var config = require('./../config');
var receiptService = require('../services/receiptService');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  receiptService.getAllReceipts()
  .then( function(response) { 
    res.render('receipt/index', {title: 'GRN listing', receipts: response.data });
  })
  .catch( function( error) { 
    next(error.toString());
  });

});


router.get('/new', function(req, res, next) {
  res.render('receipt/new');
});

module.exports = router;
