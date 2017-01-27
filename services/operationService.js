var config = require('./../config');
var axios = require('axios');

var catsV2BaseUri = config.cats_v2_base_uri;
var catsV1BaseUri = config.cats_v1_base_uri;

module.exports = {
    getAllOperations: function() {
        return axios.get(catsV2BaseUri + "operation");
    },
    createOperation: function(operation){
        console.log('----about to post new operation----');
        return axios.post(catsV2BaseUri + "operation",operation);
    },
    updateOperation: function(operation) {
        return axios.put(catsV2BaseUri + "operation",operation);
    },
    getOperationById: function(id){      
        return axios.get(catsV2BaseUri + "operation/"+id);
    },
    getAllRegions: function(){
        return axios.get(catsV1BaseUri + "AdminUnit/GetAdminUnitsByAdminUnitType/2");
    },
    getAllPrograms: function(){
        return axios.get(catsV1BaseUri + "Program/Get");
    },
    getAllPlans: function(){
        return axios.get(catsV1BaseUri + "Plan/GetPlans");
    },
    getAllRations: function(){
        return axios.get(catsV1BaseUri + "Ration/GetRations");
    },
    getRequisitionsByOperation: function (operation) {
        var requestURL = "";

        if (operation.programId == '1') /* relief */ {
            requestURL = catsV1BaseUri + "ReliefRequisition/RequisitionNos?year=" + operation.year + "&program=1" + "&planId=" + operation.planId + "&round=" + operation.round+"&month=null";
        } else if (operation.programId == '2') /* PSNP */ {
            requestURL = catsV1BaseUri + "ReliefRequisition/RequisitionNos?year=" + operation.year + "&program=2" + "&planId=" + operation.planId + "&month=" + operation.operationMonth+"&round=null";
        } else {
            return null;
        }
        console.log('getRequisitionsByOperation: request url: ' + requestURL);
        return axios.get(requestURL);
    },
    getAllocationByOperation: function(operationId){
    },
    getDispatchesByOperation: function(operationId){
        return axios.get(catsV2BaseUri + "dispatch/operation/"+operationId);
    },
    getDeliveriesByOperation: function(operationId){

    }
}