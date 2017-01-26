var express = require('express');
var config = require('./../config');
var receiptService = require('../services/receiptService');
var lookupsService = require('../services/lookupsService');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  receiptService.getAllReceipts()
  .then( function(response) { 
    res.render('receipt/index', { receipts: response.data});
  })
  .catch( function( error) { 
    next(error.toString());
  });

});


router.get('/new', function(req, res, next) {

  Promise.all([
    lookupsService.getAllCommodityCategories(), 
    lookupsService.getAllCommodities(), 
    lookupsService.getAllProjects(),
    lookupsService.getAllStores()
  ]).then( function( results ) { 
    res.render( 'receipt/new', 
    { 
      commodityCategories: results[0].data, 
      commodities: results[1].data, 
      projects: results[2].data,
      stores: results[3].data, 
      title: "New GRN"
   } );
  })
  .catch( function( error) { 
    next(error.toString());
  });
  ; 
});

router.post( '/', function(req, res, next) {

  receiptService.saveReceipt(JSON.stringify(req.body))
  .then( function(response) { 
    res.json({ id: response.data.id });
  })
  .catch( function( error) { 
    res.json({errorMessage: "Save failed. Please try again shortly!"});
  });
 
}); 

module.exports = router;
