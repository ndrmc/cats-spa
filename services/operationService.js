var config = require('./../config');
var axios = require('axios');

var catsV2BaseUri = config.cats_v2_base_uri;
var catsV1BaseUri = config.cats_v1_base_uri;

var MockAdapter = require('axios-mock-adapter');

module.exports = {
    getAllOperations: function () {
        return axios.get(catsV2BaseUri + "operation");
    },
    createOperation: function (operation) {
        console.log('----about to post new operation----');
        return axios.post(catsV2BaseUri + "operation", operation);
    },
    updateOperation: function (operation) {
        return axios.put(catsV2BaseUri + "operation", operation);
    },
    getOperationById: function (id) {
        return axios.get(catsV2BaseUri + "operation/" + id);
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
    getRequisitionsByOperation: function (operation) {
        var requestURL = "";

        if (operation.programId == '1') /* relief */ {
            requestURL = catsV1BaseUri + "ReliefRequisition/RequisitionNos?year=" + operation.year + "&program=1" + "&planId=" + operation.planId + "&round=" + operation.round + "&month=null";
        } else if (operation.programId == '2') /* PSNP */ {
            requestURL = catsV1BaseUri + "ReliefRequisition/RequisitionNos?year=" + operation.year + "&program=2" + "&planId=" + operation.planId + "&month=" + operation.operationMonth + "&round=null";
        } else {
            return null;
        }
        console.log('getRequisitionsByOperation: request url: ' + requestURL);
        return axios.get(requestURL);
    },
    getAllocationByOperation: function (operationId) {},
    getDispatchesByOperation: function (operationId) {
        return axios.get(catsV2BaseUri + "dispatch/operation/" + operationId);
    },
    getDeliveriesByOperation: function (operationId) {

    },

    getCommoditiesByOperation: function (planId) {

        var mockAdapter = new MockAdapter(axios);

        mockAdapter.onGet(catsV1BaseUri + "/HRD/GetHRD/" + planId).reply(200, {
                HRDID: 3103,
                PlanID: 4152,
                Year: 0,
                SeasonID: null,
                SeasonName: null,
                CreatedDate: '2014-03-07T09:46:55.6622772',
                PublishedDate: '2014-03-07T09:56:25.2851245',
                CreatedBY: 48,
                RationID: 0,
                TransationGroupID: 0,
                Status: null,
                PartitionId: null,
                Ration: {
                    RationID: 2011,
                    CreatedDate: '2014-03-05T00:00:00',
                    CreatedBy: 3,
                    UpdatedDate: null,
                    UpdatedBy: null,
                    IsDefaultRation: false,
                    RefrenceNumber: 'Correct Ration Rate',
                    RationDetails: [
                        {
                            "RationDetailID": 12,
                            "RationID": 3,
                            "CommodityID": 4,
                            "CommodityName": "Oil",
                            "Amount": 0.45,
                            "UnitID": 4,
                            "UnitName": "Can"
                        },
                        {
                            "RationDetailID": 14,
                            "RationID": 3,
                            "CommodityID": 2,
                            "CommodityName": "Pulse",
                            "Amount": 1.5,
                            "UnitID": 2,
                            "UnitName": "Cartons"
                        },
                        {
                            "RationDetailID": 16,
                            "RationID": 3,
                            "CommodityID": 1,
                            "CommodityName": "Cereal",
                            "Amount": 15,
                            "UnitID": 1,
                            "UnitName": "Bag"
                        }
                    ]
                },
                HRDDetails: []
            });
             var commodities = [];
        axios.get(catsV1BaseUri + "/HRD/GetHRD/" + planId)
            .then(function (response) {
                var hrd = response.data;
                var rationDetails = hrd.Ration.RationDetails;                
               

                for (var i = 0; i < rationDetails.length; i++) {
                    commodities.push({
                        name: rationDetails[i].CommodityName,
                        commodityId: rationDetails[i].CommodityID
                    });

                }

            })
            .catch(function (error) {
                console.log(error);
                throw Exception(error.toString());
            });

             console.log("commodities: ", commodities);
        return commodities;

    }
}