var express = require('express');
var config = require('./../config');
var receiptService = require('../services/receiptService');
var lookupsService = require('../services/lookupsService');
var utils = require('../services/utils'); 

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  var storeNames = {};

  receiptService.getAllReceipts()
  .then( function(response) { 

    var receipts = response.data; 

    var storePromises = []; 

    for( var i = 0; i < receipts.length; i++ ) { 
      var receipt = receipts[i];

      if( receipt.warehouseId === null ) continue; 

      if( typeof storeNames[receipt.warehouseId] === 'undefined') { 
        storeNames[receipt.warehouseId] = ''; 

        storePromises.push( lookupsService.getStoreById( receipt.warehouseId) ); 
      }
    }


    Promise.all( storePromises)
    .then( function(stores) { 
      for( var j = 0; j < stores.length; j++ ) { 
        storeNames[stores[j].data.StoreID] = stores[j].data.Name; 
      }

      for( var i = 0; i < receipts.length; i++ ) { 

        //populate storeName
        receipts[i].storeName = storeNames[receipts[i].warehouseId];

        //format receivedDate 
        var receivedDate; 

        if( receipts[i].receivedDate ) { 
          receivedDate = new Date(receipts[i].receivedDate); 

          receipts[i].receivedDate = utils.formatDate(receivedDate);
        }
      }

      res.render('receipt/index', { receipts: receipts });
    })
    .catch( function( error) { 
      next(error.toString());
    })

    
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
    lookupsService.getAllStores(), 
    lookupsService.getAllTransporters()
  ]).then( function( results ) { 
    res.render( 'receipt/new', 
    { 
      commodityCategories: results[0].data, 
      commodities: results[1].data, 
      projects: results[2].data,
      stores: results[3].data, 
      transporters: results[4].data,
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
