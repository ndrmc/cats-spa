var config = require('./../config');
var axios = require('axios');

var catsV1BaseUri = config.cats_v1_base_uri; 

module.exports = { 
    getAllCommodityCategories: function() {
        return axios.get( catsV1BaseUri + "CommodityType/GetCommodityTypes" );
    }, 
    getAllCommodities: function() { 
        return axios.get( catsV1BaseUri + "Commodity/Get" );
    },
    getAllProjects: function() { 
        return axios.get( catsV1BaseUri + "ProjectCode/Get" );
    }, 
    getAllStores() {
        return axios.get( catsV1BaseUri + "Store/Get" );
    }, 
    getAllTransporters() {
        return axios.get( catsV1BaseUri + "Transporter/Get" );
    }, 
    getStoreById( storeId ) { 
        return axios.get( catsV1BaseUri + "Store/Get/" + storeId); 
    }, 
    getCommodityCategoryById( commodityCategoryId )  { 
        return axios.get( catsV1BaseUri + "CommodityType/GetCommodityType/" + commodityCategoryId); 
    }, 
    getCommodityById( commodityId ) {
        return axios.get( catsV1BaseUri + "Commodity/Get/" + commodityId); 
    }, 
    getProjectById( projectId ) { 
        return axios.get( catsV1BaseUri + "ProjectCode/Get/" + projectId); 
    }
}