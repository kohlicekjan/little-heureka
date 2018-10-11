// @flow

var mainController = function (app) {
  app.controller('MainController', ['$rootScope', '$scope', '$location', '$window', '$translate', 'config', 'Categories', 'Products', function ($rootScope, $scope, $location, $window, $translate, config, Categories, Products) {
    $window.onload = function () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
      }

      if ('onLine' in navigator) {
        $scope.isOnLine = navigator.onLine
        window.addEventListener('online', $scope.detectOnlineStatus)
        window.addEventListener('offline', $scope.detectOnlineStatus)
      }
    }

    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
      $rootScope.showLoadingContent = true
      var params = $location.search()

      if (params.productId && (!$scope.historyUrl || $scope.historyUrl.productId !== params.productId)) {
        $scope.selectedSection = $scope.SECTION.PRODUCT_DETAIL

        $rootScope.$emit('loadProductDetail', { productId: parseInt(params.productId) })
      } else if (params.categoryId && (!$scope.historyUrl || $scope.historyUrl.categoryId !== params.categoryId || $scope.historyUrl.skip !== params.skip)) {
        $scope.selectedSection = $scope.SECTION.PRODUCT_LIST

        $rootScope.$emit('loadProductList', {
          categoryId: parseInt(params.categoryId),
          skip: parseInt(params.skip)
        })
      } else {
        $scope.selectedSection = $scope.SECTION.CATEGORY_LIST

        $rootScope.$emit('loadCategoryList', null)
      }

      $scope.historyUrl = Object.assign({}, $location.search())
    })

    $scope.detectOnlineStatus = function (event) {
      $scope.$apply(function () {
        $scope.isOnLine = navigator.onLine
      })
    }

    this.$onInit = function () {
      $scope.config = config
      $scope.showLoadingScreen = true
      $rootScope.loadingCount = 0
      $rootScope.showLoadingContent = false
      $scope.isOnLine = true

      setLang()

      $scope.SECTION = { 'CATEGORY_LIST': 1, 'PRODUCT_LIST': 2, 'PRODUCT_DETAIL': 3 }
      $scope.selectedSection = null

      $rootScope.$watch('loadingCount', function (newValue, oldValue) {
        if (newValue !== oldValue && $rootScope.loadingCount === 0) {
          $scope.showLoadingScreen = false
          $rootScope.showLoadingContent = true
        }
      })
    }

    function setLang () {
      if (!$translate.use()) {
        $translate.use('en')
      }
      $rootScope.lang = $translate.use()
    }

    $rootScope.handleErrorResponse = function (response) {
      var modalError = $('#modalError')
      switch (response.status) {
        case 400:
          console.log('API ERROR 400')
          $scope.modalError = {
            title: $translate.instant('ERROR_400_TITLE'),
            body: $translate.instant('ERROR_400_TEXT'),
            button: $translate.instant('OK')
          }
          break
        case 404:
          console.log('API ERROR 404')
          $scope.modalError = {
            title: $translate.instant('ERROR_404_TITLE'),
            body: $translate.instant('ERROR_404_TEXT'),
            button: $translate.instant('OK')
          }
          break
        case 500:
          console.log('API ERROR 500')
          $scope.modalError = {
            title: $translate.instant('ERROR_500_TITLE'),
            body: $translate.instant('ERROR_500_TEXT'),
            button: $translate.instant('OK')
          }
          break
        case -1:
          console.log('API NOT CONNECTED')
          $scope.modalError = {
            title: $translate.instant('ERROR_NOT_CONNECTED_TITLE'),
            body: $translate.instant('ERROR_NOT_CONNECTED_TEXT'),
            button: $translate.instant('OK')
          }
          break
        default:
          console.log('API UNKNOWN ERROR')
          $scope.modalError = {
            title: $translate.instant('ERROR_UNKNOWN_TITLE'),
            body: $translate.instant('ERROR_UNKNOWN_TEXT'),
            button: $translate.instant('OK')
          }
          break
      }
      modalError.modal('show')
    }

    $rootScope.loadCategories = function (isTypeAll, callback) {
      Categories.query().$promise.then(function (dataResponse) {
        $rootScope.categories = Array.from(dataResponse)

        for (var categoryIndex in $rootScope.categories) {
          $rootScope.categories[categoryIndex].count = 0
          loadProductsCount(categoryIndex)

          if (callback && isTypeAll) {
            callback(categoryIndex)
          }
        }

        if (callback && !isTypeAll) {
          callback()
        }
      })
    }

    function loadProductsCount (categoryIndex) {
      var category = $rootScope.categories[categoryIndex]
      Products.count({
        categoryId: category.categoryId
      }).$promise.then(function (dataResponse) {
        category.count = dataResponse.count
      })
    }

    $scope.selectedCategory = function () {
      return parseInt($location.search().categoryId)
    }
  }])
}

module.exports = mainController
