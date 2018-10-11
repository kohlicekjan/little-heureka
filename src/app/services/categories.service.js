// @flow

var categoriesService = function (app) {
  app.factory('Categories', ['$resource', 'config', function ($resource, config) {
    return $resource(config.API_URL + '/category/:categoryId/', { categoryId: '@categoryId' }, {
      'get': {
        url: config.API_URL + '/category/:categoryId/',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'query': {
        url: config.API_URL + '/categories/',
        method: 'GET',
        isArray: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    })
  }])
}

module.exports = categoriesService
