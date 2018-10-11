// @flow

var productListController = function (app) {
  app.controller('ProductListController', ['$rootScope', '$scope', '$location', '$translate', 'config', 'Products', 'Offers', 'Tools', function ($rootScope, $scope, $location, $translate, config, Products, Offers, Tools) {
    var $ctrl = this

    this.$onInit = function () {
      $rootScope.products = null
      $scope.selectedCategory = null
    }

    $rootScope.$on('loadProductList', function (event, args) {
      $rootScope.products = []
      $scope.breadcrumbs = null
      $scope.categoryId = args.categoryId
      $scope.skipProducts = args.skip ? args.skip : 0
      $scope.pageLimitProducts = config.PAGE_LIMIT_PRODUCTS
      $scope.selectedCategory = null

      if ($rootScope.categories) {
        load()
      } else {
        $rootScope.loadCategories(false, load)
      }
    })

    function load () {
      $scope.selectedCategory = $rootScope.categories.find(function (e) {
        return e.categoryId === $scope.categoryId
      })

      if ($scope.selectedCategory) {
        loadProducts($scope.categoryId, $scope.skipProducts)
        setBreadcrumb()
      }
    }

    function setBreadcrumb () {
      $scope.breadcrumbs = [
        {
          title: $translate.instant('CATEGORIES'),
          link: '#'
        },
        { title: $scope.selectedCategory.title, click: null }
      ]
    }

    $ctrl.selectPage = function (skipProducts) {
      var params = $location.search()
      if (parseInt(params.skip) !== skipProducts) {
        params.skip = skipProducts
        $location.search(params)
      } else {
        // fix: reload product without change url
        $rootScope.products = []
        loadProducts($scope.categoryId, $scope.skipProducts)
      }
    }

    $ctrl.selectShowMore = function (skipProducts) {
      $rootScope.showLoadingContent = false
      $scope.showLoadingShowMore = true
      loadProducts($scope.categoryId, skipProducts)
    }

    function loadProducts (categoryId, skipProducts) {
      Products.query({
        categoryId: categoryId,
        offset: skipProducts,
        limit: $scope.pageLimitProducts
      }).$promise.then(function (dataResponse) {
        var products = Array.from(dataResponse)

        if (!$rootScope.products) {
          $rootScope.products = []
        }

        var productStartIndex = $rootScope.products.length
        $rootScope.products = $rootScope.products.concat(products)
        for (var productIndex = productStartIndex; productIndex < $rootScope.products.length; productIndex++) {
          loadOffers(productIndex)
        }

        $scope.paginationCallback = { selectShowMore: $ctrl.selectShowMore, selectPage: $ctrl.selectPage }
        $scope.paginationData = {
          pageLimit: $scope.pageLimitProducts,
          totalRecords: $scope.selectedCategory.count,
          skip: skipProducts
        }

        $scope.showLoadingShowMore = false
      })
    }

    function loadOffers (productIndex) {
      var product = $rootScope.products[productIndex]

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

    $scope.priceRangeFormat = function (product) {
      if (!product.offers || !product.offers[0] || !product.offers[0].price) {
        return 0
      }

      var lastIndex = product.offers.length - 1
      if (product.offers[0].price === product.offers[lastIndex].price) {
        return Tools.numberWithSpaces(product.offers[0].price)
      } else {
        var startPrice = Tools.numberWithSpaces(product.offers[0].price)
        var endPrice = Tools.numberWithSpaces(product.offers[lastIndex].price)
        return '{0} - {1}'.format(startPrice, endPrice)
      }
    }
  }])
}

module.exports = productListController
