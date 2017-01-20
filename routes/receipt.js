var express = require('express');
var axios = require('axios');
var config = require('./../config');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


  var recieptsUri = config.get_receipts_uri; 

  axios.get( recieptsUri )
       .then( function(response) { 

         res.render('receipt/index', {title: 'GRN listing', receipts: response.data });
       })
       .catch( function( error) { 
         next(error.toString());
       });

});

module.exports = router;
