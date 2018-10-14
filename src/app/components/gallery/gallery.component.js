// @flow

var galleryTemplate = require('html-loader!./gallery.template.html')

var galleryComponent = function (app) {
  app.component('gallery', {
    template: galleryTemplate,
    bindings: {
      data: '<',
      caption: '<'
    },
    controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
      this.$onInit = function () {
        $scope.thumbsLimit = 3
        $scope.thumbsRange = Array.from({ length: $scope.thumbsLimit }, function (v, k) {
          return k + 1
        })
      }

      this.$onChanges = function (changes) {
        if (changes.data && this.data) {
          $scope.data = this.data
          $('#galleryModal').modal('hide')
        }
      }

      $scope.openGallery = function (index) {
        $scope.currentIndex = index

        $('#galleryModal').modal('show')
      }

      $scope.changeImage = function (index) {
        if (index < 0) {
          index = $scope.data.length - 1
        } else if (index > $scope.data.length - 1) {
          index = 0
        }

        $scope.currentIndex = index
      }
    }]
  })
}

module.exports = galleryComponent
