// @flow

var paginationTemplate = require('html-loader!./pagination.template.html')

var paginationComponent = function (app) {
  app.component('pagination', {
    template: paginationTemplate,
    bindings: {
      data: '<',
      callback: '<',
      link: '<'
    },
    controller: ['$rootScope', '$scope', '$translate', function ($rootScope, $scope, $translate) {
      this.$onChanges = function (changes) {
        if (changes.data && this.data) {
          generateRange(this.data.totalRecords, this.data.pageLimit, this.data.skip)
        }
        if (changes.callback && this.callback) {
          $scope.selectPage = this.callback.selectPage
          $scope.selectShowMore = this.callback.selectShowMore
        }
        if (changes.link && this.link) {
          $scope.link = this.link
        }
      }

      function generateRange (totalRecords, pageLimit, skip) {
        $scope.pageLimit = pageLimit
        $scope.totalRecords = totalRecords
        $scope.totalPages = Math.ceil(totalRecords / pageLimit)
        $scope.currentPage = Math.ceil(skip / pageLimit)
        $scope.currentSkip = skip

        // abych zajistil ze aktualni stranka bude uprostred rosahu
        var startPage = Math.max(1, $scope.currentPage - 2)
        var endPage = Math.min($scope.totalPages - 1, $scope.currentPage + 3)

        // aby se opravdu zobrazilo 5 moznych stranek z rosahu
        var missPage = 5 - (endPage - startPage)
        if (missPage > 0) {
          if ($scope.currentPage - 2 !== startPage) {
            endPage = endPage + missPage
          } else {
            startPage = startPage - missPage
          }
        }

        // korekce rosahu
        startPage = Math.max(1, startPage)
        endPage = Math.min($scope.totalPages - 1, endPage)

        // generator stranek
        $scope.pages = Array.from({ length: (endPage - startPage) }, function (v, k) {
          return k + startPage
        })
        $scope.startPage = startPage
        $scope.endPage = endPage
      }

      $scope.showMoreCount = function () {
        if ($scope.currentSkip + (2 * $scope.pageLimit) <= $scope.totalRecords) {
          return $scope.pageLimit
        } else {
          return $scope.totalRecords - ($scope.currentSkip + $scope.pageLimit)
        }
      }
    }]
  })
}

module.exports = paginationComponent
