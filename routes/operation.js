var express = require('express');
var router = express.Router();
var operationService = require('./../services/operationService');


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
                regions: results[3].data
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

    Promise.all([
            operationService.createOperation(req.body),
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

})

module.exports = router;