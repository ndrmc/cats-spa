var _ = require('lodash');
var base = require('./base');

module.exports = _.extend( {}, base, require('./' + (process.env.NODE_ENV || 'development') + '.js'));  