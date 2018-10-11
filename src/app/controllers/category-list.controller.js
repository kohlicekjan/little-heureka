// @flow

var categoryListController = function (app) {
  app.controller('CategoryListController', ['$rootScope', '$scope', '$location', '$translate', 'config', 'Categories', 'Products', 'Offers', function ($rootScope, $scope, $location, $translate, config, Categories, Products, Offers) {
    this.$onInit = function () {
      $rootScope.categories = null
    }

    $rootScope.$on('loadCategoryList', function (event, args) {
      $scope.breadcrumbs = null

      if ($rootScope.categories) {
        for (var categoryIndex in $scope.categories) {
          if (!$scope.categories[categoryIndex].img_url) {
            loadImagesProduct(categoryIndex)
          }
        }
      } else {
        $rootScope.loadCategories(true, loadImagesProduct)
      }

      setBreadcrumb()
    })

    function setBreadcrumb () {
      $scope.breadcrumbs = [{ title: $translate.instant('CATEGORIES'), link: null }]
    }

    function loadImagesProduct (categoryIndex, skipProducts) {
      if (!skipProducts) {
        skipProducts = 0
      }

      var category = $rootScope.categories[categoryIndex]
      Products.query({
        categoryId: category.categoryId,
        offset: skipProducts,
        limit: config.LOAD_BUFFER_CATEGORY_IMAGE
      }).$promise.then(function (dataResponse) {
        $rootScope.categories[categoryIndex].products = Array.from(dataResponse)

        if (!$rootScope.categories[categoryIndex].img_url && category.products && category.products.length > 0) {
          loadImagesOffer(categoryIndex, 0, skipProducts)
        }
      })
    }

    function loadImagesOffer (categoryIndex, productIndex, skipProducts) {
      var category = $rootScope.categories[categoryIndex]
      var product = category.products[productIndex]

      Offers.query({
        productId: product.productId
      }).$promise.then(function (dataResponse) {
        var offers = Array.from(dataResponse)

        for (var offerIndex in offers) {
          if (offers[offerIndex].img_url) {
            category.img_url = offers[offerIndex].img_url
            delete category.products
            break
          }
        }

        if (!category.img_url) {
          if (productIndex + 1 < category.products) {
            loadImagesOffer(categoryIndex, productIndex + 1, skipProducts)
          } else {
            loadImagesProduct(categoryIndex, skipProducts + 1)
          }
        }
      })
    }
  }])
}

module.exports = categoryListController
