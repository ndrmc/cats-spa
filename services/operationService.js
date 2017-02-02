var config = require('./../config');
var axios = require('axios');

var catsV2BaseUri = config.cats_v2_base_uri;
var catsV1BaseUri = config.cats_v1_base_uri;

var MockAdapter = require('axios-mock-adapter');

 
       
       

module.exports = {
    getAllOperations: function () {
        return axios.get(catsV2BaseUri + "operations");
    },
    createOperation: function (operation) {
        console.log('----about to post new operation----');
        return axios.post(catsV2BaseUri + "operations", operation);
    },
    updateOperation: function (operation) {
        return axios.put(catsV2BaseUri + "operations", operation);
    },
    getOperationById: function (id) {
        return axios.get(catsV2BaseUri + "operations/" + id);
    },
    getAllRegions: function () {
        return axios.get(catsV1BaseUri + "AdminUnit/GetAdminUnitsByAdminUnitType/2");
    },
    getAllPrograms: function () {
        return axios.get(catsV1BaseUri + "Program/Get");
    },
    getAllPlans: function () {
        return axios.get(catsV1BaseUri + "Plan/GetPlans");
    },
    getAllRations: function () {
        return axios.get(catsV1BaseUri + "Ration/GetRations");
    },
    getRequestsByOperation: function (operation) {
        var requestURL = "";

        if (operation.programId == '1') /* relief */ {
            requestURL = catsV1BaseUri + "RegionalRequest/Request?year=" + operation.year + "&programId=1" + "&planId=" + operation.planId + "&round=" + operation.round + "&month=null";
        } else if (operation.programId == '2') /* PSNP */ {
            requestURL = catsV1BaseUri + "RegionalRequest/Request?year=" + operation.year + "&programId=2" + "&planId=" + operation.planId + "&month=" + operation.operationMonth + "&round=null";
        } else {
            return null;
        }
        
        return axios.get(requestURL);
    },
    getAllocationByOperation: function (operation) {
       

        if (operation.programId == '1') // relief 
         {
            requestURL = catsV1BaseUri + "ReliefRequisition/Allocation?year=" + operation.year + "&program=1" + "&planId=" + operation.planId + "&round=" + operation.round + "&month=null";
        } else if (operation.programId == '2') // PSNP 
        {
            requestURL = catsV1BaseUri + "ReliefRequisition/Allocation?year=" + operation.year + "&program=2" + "&planId=" + operation.planId + "&month=" + operation.operationMonth + "&round=null";
        } else {
            return null;
        }
        console.log('getAllocationByOperation: request url: ' + requestURL);
        return axios.get(requestURL);
    },
    getDispatchesByOperation: function (operationId) {
        return axios.get(catsV2BaseUri + "dispatches/operation/" + operationId);
    },
    getDeliveriesByOperation: function (operationId) {

    },

    getCommoditiesByOperation: function (planId) {  
        return axios.get(catsV1BaseUri + "HRD/GetHRDByPlanId/" + planId)           
       
    },
    addOperationRegion: function(operationRegion){
        return axios.post(catsV2BaseUri + "operationRegion/",operationRegion);
    }
}