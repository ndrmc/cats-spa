var express = require('express');
var router = express.Router();
var operationService = require('./../services/operationService');

var months = [{
    id: 1,
    name: "January"
},{
    id: 2,
    name: "February"
},
{
    id: 3,
    name: "March"
},
{
    id: 4,
    name: "April"
},
{
    id: 5,
    name: "May"
},
{
    id: 6,
    name: "June"
},
{
    id: 7,
    name: "July"
},
{
    id: 8,
    name: "August"
},
{
    id: 9,
    name: "September"
},
{
    id: 10,
    name: "October"
},
{
    id: 11,
    name: "November"
},
{
    id: 12,
    name: "December"
}
];

router.get('/', function (req, res, next) {

    operationService.getAllOperations()
        .then(function (response) {
            res.render('operation/index', {
                operations: response.data
            });
        })
        .catch(function (error) {
            next(error.toString());
        });

});

router.get('/new', function (req, res, next) {
    Promise.all([
            operationService.getAllPlans(),
            operationService.getAllPrograms(),
            operationService.getAllRations(),
            operationService.getAllRegions()
        ])
        .then(function (results) {            
            res.render('operation/new', {
                plans: results[0].data,
                programs: results[1].data,
                rations: results[2].data,
                regions: results[3].data,
                months: months
            });
        })
        .catch(function (error) {
            console.log('----error----' + error)
            next(error.toString());
        });

});

router.route('/:id')
    .get(function (req, res, next) {
        var id = req.params.id;
        console.log('---------id----------' + id);
        Promise.all([
                operationService.getAllPlans(),
                operationService.getAllPrograms(),
                operationService.getAllRations(),
                operationService.getAllRegions(),
                operationService.getOperationById(id),
            ])
            .then(function (results) {
                var operation = results[4].data;
                var operationRegions = [];
                for (var i = 0; i < operation.operationRegions.length; i++) {
                    console.log("-region-------" + operation.operationRegions[i].regionId);
                    operationRegions.push(operation.operationRegions[i].regionId);
                };
                res.render('operation/edit', {
                    plans: results[0].data,
                    programs: results[1].data,
                    rations: results[2].data,
                    regions: results[3].data,
                    operation: operation,
                    operationRegions: operationRegions
                });
            })
            .catch(function (error) {
                next(error.toString());
            });

    });


router.post('/new', function (req, res, next) {

    console.log('---------new operation submitted-----------');

    var operationRegion = [];
    for (var i = 0; i < req.body.region.length; i++) {
        operationRegion.push({
            regionId: req.body.region[i]
        });

    }
    req.body.operationRegions = operationRegion;

    req.body.expectedStart = new Date(Date.parse(req.body.expectedStart)).toISOString();
    req.body.plannedEnd = new Date(Date.parse(req.body.plannedEnd)).toISOString();
    delete req.body['region'];

    console.log(req.body);

    operationService.createOperation(req.body)
        .then(function (response) {
            operationService.getAllOperations()
                .then(function (result) {
                    var operations = result.data;
                    res.render('operation/index', {
                        operations: operations
                    });
                })
                .catch(function(error){
                    console.log(error);
                    next("Error fetching records. Reason: "+error.toString());
                });
        })
        .catch(function (error) {
            next(error.toString());
        });

});

router.post('/:id', function (req, res, next) {
    if (req.body._method == "PUT") {
        console.log("-----update operation-----");

        var operationRegion = [];
        for (var i = 0; i < req.body.region.length; i++) {
            operationRegion.push({
                regionId: req.body.region[i]
            });

        }
        req.body.operationRegions = operationRegion;

        req.body.expectedStart = new Date(Date.parse(req.body.expectedStart)).toISOString();
        req.body.plannedEnd = new Date(Date.parse(req.body.plannedEnd)).toISOString();
        delete req.body['region'];

        console.log(req.body);

        Promise.all([
                operationService.updateOperation(req.body),
                operationService.getAllOperations()
            ])
            .then(function (results) {
                var operations = results[1].data;
                res.render('operation/index', {
                    operations: operations
                });
            })
            .catch(function (error) {
                next(error.toString());
            });
    }

});

router.get('/:id/details', function (req, res, next) {
    var id = req.params.id;

    operationService.getOperationById(id)
    .then(function (response) {

        var operation = response.data;
        var operationRegions = [];

        for (var i = 0; i < operation.operationRegions.length; i++) {
            operationRegions.push(operation.operationRegions[i].regionId);
        };
        Promise.all([
                operationService.getRequisitionsByOperation(operation),
                operationService.getAllocationByOperation(id),
                operationService.getDispatchesByOperation(id),
                operationService.getDeliveriesByOperation(id)
            ])
            .then(function (results) {

                res.render('operation/details', {
                    operation: operation,
                    operationRegions: operationRegions,
                    // requisitions: results[0].data,
                    // allocations: results[1].data,
                    // dispatches: results[2].data,
                    // deliveries: results[3].data,
                });
            })
            .catch(function (error) {
                next(error.toString());
            });

    }).catch(function (error) {

    });
});



module.exports = router;