// @flow

require('../assets/styles/sass/main.scss')

require('bootstrap/dist/js/bootstrap.min.js')
require('jquery')

var angular = require('angular')
// var angularRoute = require('angular-route')
// var angularResource = require('angular-resource')

var app = angular.module('little-heureka', ['ngResource'])

require('./app.config.js')(app)
