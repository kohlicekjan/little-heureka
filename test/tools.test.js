require('angular')
require('angular-mocks')
var toolsFactory = require('../src/app/factories/tools.factory.js')

describe('Factory - Tools', function () {

  beforeEach(function () {
    toolsFactory(angular.module('tools-module', []))
    angular.mock.module('tools-module')
  })

  var _tools

  beforeEach(function () {
    inject(function (Tools) {
      _tools = Tools
    })
  })

  describe('numberWithSpaces', function () {
    it('10000 should equal 10 000', function () {
      var result = _tools.numberWithSpaces(10000)
      expect(result).toEqual('10 000')
    })

    it('"" should equal ""', function () {
      var result = _tools.numberWithSpaces('')
      expect(result).toEqual('')
    })

    it('null should equal ""', function () {
      var result = _tools.numberWithSpaces(null)
      expect(result).toEqual('')
    })

    it('undefined should equal ""', function () {
      var result = _tools.numberWithSpaces(undefined)
      expect(result).toEqual('')
    })
  })

  describe('sortByPrice', function () {
    it('sort correctly sorted array ', function () {
      var array = [
        { price: 20 },
        { price: 30 }
      ]
      var result = array.sort(_tools.sortByPrice)
      expect(result).toEqual(array)
    })

    it('sort unordered array', function () {
      var array = [
        { price: 30 },
        { price: 10 }
      ]

      var result = array.sort(_tools.sortByPrice)
      expect(result).toEqual([
        { price: 10 },
        { price: 30 }
      ])
    })

    it('sort empty array', function () {
      var result = [].sort(_tools.sortByPrice)
      expect(result).toEqual([])
    })

    it('sort array without price', function () {
      var array = [
        { key: 30 },
        { price: 10 },
        { price: 30 }
      ]

      var result = array.sort(_tools.sortByPrice)
      expect(result).toEqual([
        { price: 10 },
        { price: 30 },
        { key: 30 }
      ])
    })
  })

})
