# `little-heureka` - Malá Heureka

Fontend price comparator inspired by [Heureka.cz](https://www.heureka.cz/).

This app is [PWA](https://developers.google.com/web/progressive-web-apps/) type, its main benefits are in reliable, fast and engaging.

The application is written in [AngularJS](https://github.com/angular/angular.js) and [Bootstrap 4](https://github.com/twbs/bootstrap). As [service-workers](https://developers.google.com/web/fundamentals/primers/service-workers/) was selected [Workbox](https://github.com/GoogleChrome/workbox).

[Webpack 4](https://github.com/webpack/webpack) is used to build an application. With the help WebPack generating [service-workers](https://developers.google.com/web/fundamentals/primers/service-workers/), [manifest](https://developers.google.com/web/fundamentals/web-app-manifest/), [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
Also compiles [SASS](https://github.com/sass/sass) to CSS, tree shaking and minify code.

Test platform [Jest](https://github.com/facebook/jest) was used for unit tests, end-to-end tests are solved testing tool [Cypress](https://github.com/cypress-io/cypress).

The code check is used with [ESLint](https://github.com/eslint/eslint), [Flow](https://github.com/facebook/flow) and [stylelint](https://github.com/stylelint/stylelint).

## Quick Start
Prerequisites: [Node.js](https://nodejs.org/en/) (>=10), npm version 6+.

Clone the `little-heureka` repository using git:

```bash
$ git clone https://github.com/kohlicekjan/little-heureka.git
$ cd little-heureka
```

Install dependencies:

```bash
$ npm install
```

Start the server:

```bash
$ npm start
```

Now browse to the app at [`localhost:3000`].

## Configuration

The configuration files are in the `./config/`.
The files `development.json` and `production.json` overwrite the main configuration file `default.json`.

This is the default configuration:
```json
{
  "API_URL": "http://localhost:3003",
  "PAGE_LIMIT_OFFERS": 3,
  "PAGE_LIMIT_PRODUCTS": 5,
  "LOAD_BUFFER_CATEGORY_IMAGE": 2
}
```

## Build

Install dependencies:

```bash
$ npm install
```

And build:

```bash
$ npm run build:production
```
Output directory is `./dist`

## Testing
To run the tests, first start app using `npm start`, then run `npm test`.

#### Unit Test
Unit tests use the [Jest](https://github.com/facebook/jest) test platform. The tests are in directory `./test/`.

Run unit tests:

```bash
$ npm test:unit
```

#### End-to-End Test
Tests is written for  frontend testing tool [Cypress](https://github.com/cypress-io/cypress), configuration is in `cypress.json`.
The tests are in directory `./test/integration/`.

Run end-to-end tests:

```bash
$ npm run test:e2e
```

To manually run end-to-end tests:

```bash
$ npm run cypress:open
```

#### Web analytics

For web analytics, performance metrics and insights on best practices:

```bash
$ npm run test:lighthouse:audit
```

For web security analytics:

```bash
$ npm run test:lighthouse:security
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Samsung |
| --------- | --------- | --------- | --------- | --------- |
| Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Screenshot

<p align="center">
    <img alt="" src="https://raw.githubusercontent.com/kohlicekjan/little-heureka/master/doc/images/screenshots/category_list_1.png" width="75%" />
</p>
