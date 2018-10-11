// @flow

var productsService = function (app) {
  app.factory('Products', ['$resource', 'config', function ($resource, config) {
    return $resource(config.API_URL + '/product/:productId/', {
      productId: '@productId',
      categoryId: '@categoryId',
      offset: '@offset',
      limit: '@limit'
    }, {
      'get': {
        url: config.API_URL + '/product/:productId/',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'query': {
        url: config.API_URL + '/products/:categoryId/:offset/:limit/',
        method: 'GET',
        isArray: true,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'count': {
        url: config.API_URL + '/products/:categoryId/count/',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    })
  }])
}

module.exports = productsService
