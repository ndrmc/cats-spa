var express = require('express');
var lookupsService = require('../services/lookupsService');
var dispatchService = require('../services/dispatchService');

var router = express.Router();

/* GET dispatches listing. */
router.get('/', function(req, res, next) {

  var fdpsBeingLookedUp = []; 
  var fdpPromises =[]; 

  var fdpNamingMap = {}; 

  dispatchService.getAllDispatches()
  .then( function(response) { 
    var dispatches = response.data; 

    for( var i = 0; i < dispatches.length; i++ ) { 
      var dispatch = dispatches[i];
      if( fdpsBeingLookedUp.indexOf(dispatch.fdpId) == -1  ) { 
        fdpsBeingLookedUp.push( dispatch.fdpId); 

       fdpPromises.push( lookupsService.getFdpById( dispatch.fdpId)); 
      }
    }

    Promise.all( fdpPromises)
    .then( function(results ) { 
      for( var j = 0; j < results.length; j++ ) { 
        fdpNamingMap[results[j].data.FDPID] = results[j].data.Name; 
      }

      for( var i = 0; i < dispatches.length; i++ ) { 
         var dispatch = dispatches[i];

         dispatch.fdp = fdpNamingMap[dispatch.fdpId]; 
      } 

      res.render( 'dispatch/index', {dispatches: dispatches }); 


    })
    .catch( function(error) { 
      next( new Error(error)); 
    })
    ; 

    
  })
  .catch( function(error) { 
    next( new Error(error)); 
  })
  ; 

});

router.get('/new', function(req, res, next) {

  Promise.all([
    lookupsService.getAllCommodityCategories(), 
    lookupsService.getAllCommodities(), 
    lookupsService.getAllProjects(),
    lookupsService.getAllOperations(), 
    lookupsService.getAllTransporters()
  ]).then( function( results ) { 
    res.render( 'dispatch/new', 
    { 
      commodityCategories: results[0].data, 
      commodities: results[1].data, 
      projects: results[2].data,
      operations: results[3].data, 
      transporters: results[4].data,
      title: "New Dispatch"
   } );
  })
  .catch( function( error) { 
    next(error.toString());
  });
  ; 
});


router.post( '/', function(req, res, next) {

  dispatchService.saveDispatch(req.body.dispatch)
  .then( function(response) { 
    res.json({ id: response.data.id });
  })
  .catch( function( error) { 
    res.json({errorMessage: "Save failed. Please try again shortly!"});
  });
 
}); 

router.put( '/', function(req, res, next) {

  dispatchService.saveDispatch(req.body.id, req.body.saveDispatch)
  .then( function(response) { 
    res.json({ id: response.data.id });
  })
  .catch( function( error) { 
    res.json({errorMessage: "Save failed. Please try again shortly!"});
  });
 
}); 

module.exports = router; 
