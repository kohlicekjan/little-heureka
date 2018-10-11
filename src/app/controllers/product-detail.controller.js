// @flow

var productDetailController = function (app) {
  app.controller('ProductDetailController', ['$rootScope', '$scope', '$location', '$translate', 'config', 'Products', 'Offers', 'Tools', function ($rootScope, $scope, $location, $translate, config, Products, Offers, Tools) {
    this.$onInit = function () {
      $rootScope.products = null
      $scope.Tools = Tools
    }

    $rootScope.$on('loadProductDetail', function (event, args) {
      $scope.breadcrumbs = null
      $scope.productId = args.productId
      $scope.selectedProduct = null
      $scope.selectedCategory = null
      $scope.pageLimitOffers = config.PAGE_LIMIT_OFFERS

      if ($rootScope.products) {
        $scope.selectedProduct = $rootScope.products.find(function (e) {
          return e.productId === $scope.productId
        })

        if ($scope.selectedProduct) {
          load()
        } else {
          loadProduct()
        }
      } else {
        loadProduct()
      }
    })

    function load () {
      if ($rootScope.categories) {
        $scope.selectedCategory = $rootScope.categories.find(function (e) {
          return e.categoryId === $scope.selectedProduct.categoryId
        })

        setBreadcrumb()
      } else {
        $rootScope.loadCategories(false, load)
      }
    }

    function setBreadcrumb () {
      $scope.breadcrumbs = [
        {
          title: $translate.instant('CATEGORIES'),
          link: '#'
        },
        {
          title: $scope.selectedCategory.title,
          link: '#!?categoryId={categoryId}'.format($scope.selectedCategory)
        },
        { title: $scope.selectedProduct.title, click: null }
      ]
    }

    function loadProduct () {
      Products.get({
        productId: $scope.productId
      }).$promise.then(function (dataResponse) {
        $scope.selectedProduct = dataResponse

        load()
        loadOffers()
      })
    }

    function loadOffers () {
      var product = $scope.selectedProduct

      Offers.query({
        productId: product.productId
      }).$promise.then(function (dataResponse) {
        product.offers = Array.from(dataResponse).sort(Tools.sortByPrice)
        product.images = []

        var offers = product.offers
        for (var offerIndex in offers) {
          if (offers[offerIndex].img_url) {
            product.img_url = offers[offerIndex].img_url
            product.images.push({ url: offers[offerIndex].img_url })
          }

          if (offers[offerIndex].description) {
            product.description = offers[offerIndex].description
          }
        }
      })
    }
  }])
}

module.exports = productDetailController
