# `little-heureka` - Malá Heureka

Fontend price comparator inspired by Heureka.cz

---
Tato aplikace je typu PWA, jejíž hlavními znaky jsou responzivita, nezávislost na připojení.

Základ aplikace je založen na AngularJS a Bootstrap 4. který hlavně řeší responzivitu. Pro nezávislost na připojení jsem zvolil service workers Workbox.

Pro zabalení celé aplikace jsem vybral Webpack 4, stará se o generování service workers, manifestu, Content Security Policy.
Také provádí tree shaking pro odstranění mrtvého kódu, předovod SASS do CSS a minifikaci kódu.

Pro unit testy je požit Jest a end-to-end testy se řeší pomoci Cypress.

Pro kontrolu kódu jsem použil již standardy eslint, flow a stylelint.

---

## Quick Start
To start it needs to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

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

Now browse to the app at [`localhost:3000/index.html`][local-app-url].

## Build
Output directory build is `/dist`

### Development

Dev build adds the source map: 

```bash
$ npm run build:dev 
```

### Production

Production build makes minification and adds Content Security Policy:

```bash
$ npm run build:production
```

## Testing

To run unit and end-to-end test:

```bash
$ npm test
```

### Unit Test

Only test units:

```bash
$ npm test:unit
```

### End-to-End Test
Only end-to-end:

```bash
$ npm run test:e2e
```

To manually run end-to-end tests:

```bash
$ npm run cypress:open
```

### Web analytics

For web analytics, performance metrics and insights on best practices:

```bash
$ npm run test:lighthouse:audit
```

For web security analytics:

```bash
$ npm run test:lighthouse:security
```

## Screenshot

<p align="center">
    <img alt="" src="https://raw.githubusercontent.com/kohlicekjan/little-heureka/master/doc/images/screenshots/category_list_1.png" width="75%" />
</p>
