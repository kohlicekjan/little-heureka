// @flow

require('../assets/styles/sass/main.scss')

/* Bootstrap 4 */
// require('bootstrap/dist/js/bootstrap.min.js')
require('jquery')
require('bootstrap/js/dist/alert')
// require('bootstrap/js/dist/button')
// require('bootstrap/js/dist/carousel')
// require('bootstrap/js/dist/collapse')
// require('bootstrap/js/dist/dropdown')
require('bootstrap/js/dist/modal')
// require('bootstrap/js/dist/popover')
// require('bootstrap/js/dist/scrollspy')
// require('bootstrap/js/dist/tab')
// require('bootstrap/js/dist/tooltip')
require('bootstrap/js/dist/util')

var format = require('string-format')
format.extend(String.prototype, {})

/* AngularJS */
require('angular/angular.min')
require('angular-resource/angular-resource.min')
require('angular-translate/dist/angular-translate.min')

var app = angular.module('little-heureka', ['ngResource', 'pascalprecht.translate'])

require('./app.config.js')(app)

/* services */
require('./services/categories.service')(app)
require('./services/products.service')(app)
require('./services/offers.service')(app)

/* components */
require('./components/pagination/pagination.component')(app)
require('./components/breadcrumb/breadcrumb.component')(app)
require('./components/gallery/gallery.component')(app)

/* factories */
require('./factories/tools.factory')(app)

/* controllers */
require('./controllers/main.controller')(app)
require('./controllers/product-list.controller')(app)
require('./controllers/product-detail.controller')(app)
require('./controllers/category-list.controller')(app)
