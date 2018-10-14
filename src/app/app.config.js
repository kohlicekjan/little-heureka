// @flow

var localeEN = require('../assets/locales/locale-en')
var localeCZ = require('../assets/locales/locale-cz')

// path: ./config/default.json
var globalConfig = __CONFIG__

var appConfig = function (app) {
  app.constant('config', {
    APP_VERSION: __VERSION__,
    API_URL: globalConfig.API_URL,
    PAGE_LIMIT_OFFERS: parseInt(globalConfig.PAGE_LIMIT_OFFERS),
    PAGE_LIMIT_PRODUCTS: parseInt(globalConfig.PAGE_LIMIT_PRODUCTS),
    LOAD_BUFFER_CATEGORY_IMAGE: parseInt(globalConfig.LOAD_BUFFER_CATEGORY_IMAGE)
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
