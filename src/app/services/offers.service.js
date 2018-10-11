// @flow

var offersService = function (app) {
  app.factory('Offers', ['$resource', 'config', function ($resource, config) {
    return $resource(config.API_URL + '/offer/:offerId', {
      offerId: '@offerId',
      productId: '@productId',
      offset: '@offset',
      limit: '@limit'
    }, {
      'get': {
        url: config.API_URL + '/offer/:offerId/',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        }
      },
      'query': {
        url: config.API_URL + '/offers/:productId/:offset/:limit/',
        method: 'GET',
        isArray: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        }
      },
      'count': {
        url: config.API_URL + 'offers/:productId/count/',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    })
  }])
}

module.exports = offersService
