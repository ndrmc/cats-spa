var express = require('express');
var config = require('./../config');
var receiptService = require('../services/receiptService');
var lookupsService = require('../services/lookupsService');
var utils = require('../services/utils'); 
var _ = require('lodash');

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

router.get('/edit/:id',  function(req, res, next) { 
  Promise.all([
    lookupsService.getAllCommodityCategories(), 
    lookupsService.getAllCommodities(), 
    lookupsService.getAllProjects(),
    lookupsService.getAllStores(), 
    lookupsService.getAllTransporters(),
    receiptService.getReceiptById(req.params.id)
  ]).then( function( results ) { 

    var receipt = results[5].data; 


    var categoriesWillPopulate = Promise.all( _.map(receipt.receiptLines, function(it ) { return lookupsService.getCommodityCategoryById(it.commodityCategoryId)})).then( function( resps ) {
      _.forEach( resps, function( result, index ) {
        receipt.receiptLines[index].commodityCategory = result.data.Name; 
      }); 
    }); 

    var commoditiesWillPopulate = Promise.all( _.map(receipt.receiptLines, function(it ) { return lookupsService.getCommodityById(it.commodityId)})).then( function( resps ) {
      _.forEach( resps, function( result, index ) {
        receipt.receiptLines[index].commodity = result.data.Name; 
      }); 
    }); 

    var projectsWillPopulate = Promise.all( _.map(receipt.receiptLines, function(it ) { return lookupsService.getProjectById(it.projectId)})).then( function( resps ) {
      _.forEach( resps, function( result, index ) {
        receipt.receiptLines[index].project = result.data.Value; 
      }); 
    });

    


    Promise.all( [categoriesWillPopulate, commoditiesWillPopulate, projectsWillPopulate]).then(function() {

      receipt.receiptLines = _.map(receipt.receiptLines, function(it ) { it.uid = it.id; return it; }); 
      
      res.render( 'receipt/edit', 
      { 
        commodityCategories: results[0].data, 
        commodities: results[1].data, 
        projects: results[2].data,
        stores: results[3].data, 
        transporters: results[4].data,
        receipt: receipt,
        title: "Edit GRN"
     });

    })
    .catch(function(error) { 
      next(error.toString());
    }); 



    
  })
  
});

router.post( '/', function(req, res, next) {

  receiptService.saveReceipt(req.body.receipt)
  .then( function(response) { 
    res.json({ id: response.data.id });
  })
  .catch( function( error) { 
    res.json({errorMessage: "Save failed. Please try again shortly!"});
  });
 
}); 

router.put( '/', function(req, res, next) {

  receiptService.updateReceipt(req.body.id, req.body.receipt)
  .then( function(response) { 
    res.json({ id: response.data.id });
  })
  .catch( function( error) { 
    res.json({errorMessage: "Save failed. Please try again shortly!"});
  });
 
}); 

module.exports = router;
