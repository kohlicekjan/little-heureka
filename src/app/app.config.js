// @flow

var localeEN = require('../assets/locales/locale-en')
var localeCZ = require('../assets/locales/locale-cz')

var appConfig = function (app) {
  app.constant('config', {
    APP_VERSION: VERSION,
    API_URL: 'https://private-anon-917737df85-catalogue9.apiary-proxy.com/',
    PAGE_LIMIT_OFFERS: 3,
    PAGE_LIMIT_PRODUCTS: 5,
    LOAD_BUFFER_CATEGORY_IMAGE: 2
  })

  app.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false
  }])

  app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor')
  }])

  app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape')
    $translateProvider.translations('en', localeEN)
    $translateProvider.translations('cs', localeCZ)
    $translateProvider.registerAvailableLanguageKeys(['en', 'cs'], {
      'en_*': 'en',
      'cs-CZ': 'cs'
    })

    $translateProvider.fallbackLanguage('en')
    $translateProvider.determinePreferredLanguage()
  }])

  app.factory('HttpInterceptor', ['$q', '$rootScope', '$injector',
    function ($q, $rootScope, $injector) {
      return {
        'request': function (config) {
          $rootScope.loadingCount++

          return config
        },
        'requestError': function (rejection) {
          if (canRecover(rejection)) {
            return responseOrNewPromise
          }
          return $q.reject(rejection)
        },
        'response': function (response) {
          $rootScope.loadingCount--

          return response
        },
        'responseError': function (rejection) {
          $rootScope.loadingCount--
          $rootScope.handleErrorResponse(rejection)

          if (canRecover(rejection)) {
            return responseOrNewPromise
          }
          return $q.reject(rejection)
        }
      }
    }
  ])
}

module.exports = appConfig
