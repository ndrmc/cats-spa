var config = require('./../config');
var axios = require('axios');

var catsV2BaseUri = config.cats_v2_base_uri; 

module.exports = { 
    getAllDispatches: function() { 
        return axios.get( catsV2BaseUri + "dispatches" );
    }, 

    getDispatchById: function( id ) { 
        return axios.get( catsV2BaseUri + "dispatches/" + id  );
    },

    saveDispatch: function( dispatchObj ) { 
        return axios.post( 
            catsV2BaseUri + "dispatches", 
            dispatchObj, 
            {
                headers: { 
                    "Content-Type": "application/json"
                }
            }
       ); 
    }, 

    updateDispatch: function(id, dispatchObj) { 
        return axios.put( 
                    catsV2BaseUri + "dispatches/" + id, 
                    dispatchObj, 
                    {
                        headers: { 
                            "Content-Type": "application/json"
                        }
                    }
            );
    }
}