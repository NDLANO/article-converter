# NDLA article-oembed
[![Build Status](https://travis-ci.org/NDLANO/article-oembed.svg?branch=master)](https://travis-ci.org/NDLANO/article-oembed)

## Requirements

- Node.JS ~6.2
- npm ~3.9
- Docker (optional)

## Getting started

What's in the box?

- Express
- React
- Babel (ES6)

### Dependencies

All dependencies are defined in `package.json` and are managed with npm.  To
initially install all dependencies and when the list dependency has changed,
run `npm install`.

```
$ npm install
```

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```
$ npm start
```

To use a different api set the `NDLA_API_URL` environment variable.

### Unit tests

Test framework: ava with enzyme.

```
$ npm test
```

Do you tdd?

```
$ npm run tdd
```
### Code style

*tl;dr*: Use eslint! Rules: [Airbnb Styleguide]https://github.com/airbnb/javascript.

Lint code with [eslint](http://eslint.org/), including [eslint react plugin](https://github.com/yannickcr/eslint-plugin-react), [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import), [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y#readme).
Beside linting with globally installed eslint, eslint can be invoked with `npm`:

```
$ npm run lint
```

Rules are configured in `./.eslintrc.js` and extends [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb). If feeling brave, try `eslint --fix`.


## Other scripts

```
# Run with NODE_ENV=production:
$ npm run start-prod
```

```
# Docker stuff
$ ./build.sh
```

## Dependencies

Please update this section if you add or remove dependencies.
Hint: Running `npm ls --long --depth 0` prints a list of dependencies including a brief description.

### Server

**express:**
Fast, unopinionated, minimalist web framework
http://expressjs.com/

**nodemon:**
Simple monitor script for use during development of a node.js app.
http://nodemon.io

**compression**
Node.js compression middleware
https://github.com/expressjs/compression#readme

**cors**
Middleware for dynamically or statically enabling CORS in express/connect applications
https://github.com/expressjs/cors/

**react:**
React is a JavaScript library for building user interfaces.
https://facebook.github.io/react/

**react-dom:**
React package for working with the DOM.
https://facebook.github.io/react/

### Util

**defined:**
return the first argument that is `!== undefined`.
https://github.com/substack/defined

**lodash:**
Lodash modular utilities.
https://lodash.com/

**cross-env**
Run commands that set environment variables across platforms
https://github.com/kentcdodds/cross-env

**parse5**
WHATWG HTML5 specification-compliant, fast and ready for production HTML parsing/serialization toolset for Node.js
https://github.com/inikulin/parse5

### ES2015/6

**babel-register:**
babel require hook
https://babeljs.io/

**babel-preset-es2015:**
Babel preset for all ES2015 plugins.
https://babeljs.io/

**babel-polyfill:**
Polyfill for  a full ES2015 environment
https://babeljs.io/

**babel-preset-react:**
Babel preset for all React plugins.
https://babeljs.io/

**babel-plugin-transform-object-rest-spread:**
Compile object rest and spread to ES5
https://babeljs.io/

**babel-plugin-transform-async-to-generator**
Turn async functions into ES2015 generators
https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-async-to-generator

**isomorphic-fetch:**
Isomorphic WHATWG Fetch API, for Node & Browserify.
https://github.com/matthew-andrews/isomorphic-fetch/issues

### Testing

**ava**
Futuristic test runner 🚀
git+https://github.com/avajs/ava.git

### Code style

**eslint:**
An AST-based pattern checker for JavaScript.
http://eslint.org

**babel-eslint**
Custom parser for ESLint
https://github.com/babel/babel-eslint

**eslint-plugin-babel**
An eslint rule plugin companion to babel-eslint
https://github.com/babel/eslint-plugin-babel#readme

**eslint-config-airbnb:**
Airbnb's ESLint config, following their styleguide
https://github.com/airbnb/javascript

**eslint-plugin-import:**
Import with sanity.
https://github.com/benmosher/eslint-plugin-import

**eslint-plugin-jsx-a11y:**
A static analysis linter of jsx and their accessibility with screen readers.
https://github.com/evcohen/eslint-plugin-jsx-a11y#readme

**eslint-plugin-react:**
React specific linting rules for ESLint.
https://github.com/yannickcr/eslint-plugin-react
