// @flow

function numberWithSpaces (number) {
  if (!number) {
    return ''
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function sortByPrice (a, b) {
  if (!a.price) {
    return 1
  }
  return a.price < b.price ? -1 : (a.price > b.price ? 1 : 0)
}

var toolsFactory = function (app) {
  app.factory('Tools', [function () {
    return {
      numberWithSpaces: numberWithSpaces,
      sortByPrice: sortByPrice
    }
  }])
}

module.exports = toolsFactory
