var config = require('./../config');
var axios = require('axios');

var catsV2BaseUri = config.cats_v2_base_uri; 

module.exports = { 
    getAllReceipts: function() { 
        return axios.get( catsV2BaseUri + "receipts" );
    }
}