// @flow

var breadcrumbTemplate = require('html-loader!./breadcrumb.template.html')

var breadcrumbComponent = function (app) {
  app.component('breadcrumb', {
    template: breadcrumbTemplate,
    bindings: {
      data: '<'
    },
    controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
      this.$onInit = function () {

      }
    }]
  })
}

module.exports = breadcrumbComponent
