# NDLA article-converter
[![Build Status](https://travis-ci.org/NDLANO/article-converter.svg?branch=master)](https://travis-ci.org/NDLANO/article-converter)

## API documentation

Article converter is an api for getting a extended html version of the content attribute provided by [Article API](https://github.com/NDLANO/article-api). The service has two endpoints:

**/article-converter/json/:lang/:articleId**

_Returns an extended and transformed json structure based on the one provided by [Article API](https://github.com/NDLANO/article-api)_

**/article-converter/html/:lang/:articleId**

_Returns the content attribute from [Article API](https://github.com/NDLANO/article-api) transformed to plain html and wrapped in a HTML document (useful for testing)_

The service mainly converts `<embed>` tags in the content attribute to appropriate html tags. For some embed tags fetching additional data from other api's is required.


### Developer notes
To properly display the converted html some script from [ndla-article-scripts](https://github.com/NDLANO/frontend-packages/tree/master/packages/ndla-article-scripts) is required. See [ndla-frontend](https://github.com/NDLANO/ndla-frontend) for examples.

## Developer documentation


### Requirements

- Node.JS ~6.10
- npm ~3.10
- Yarn ~0.23.2
- Docker (optional)

### Getting started

#### Dependencies

All dependencies are defined in `package.json` and are managed with yarn/npm.  To
initially install all dependencies and when the list dependency has changed,
run `yarn`.

```
$ yarn
```

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```$ yarn start```

To use a different api set the `NDLA_API_URL` environment variable.

#### Unit tests

Test framework: jest.

```$ yarn test```

Do you tdd?

```$ yarn run tdd```

#### Code style

*tl;dr*: Use eslint! Rules: [Airbnb Styleguide]https://github.com/airbnb/javascript.

Lint code with [eslint](http://eslint.org/), including [eslint react plugin](https://github.com/yannickcr/eslint-plugin-react), [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import), [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y#readme).
Beside linting with globally installed eslint, eslint can be invoked with `npm`:

```
$ yarn run lint
```

Rules are configured in `./.eslintrc.js` and extends [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb). If feeling brave, try `eslint --fix`.


#### Other scripts

```
# Run with NODE_ENV=production:
$ npm yarn start-prod
```

```
# Docker stuff
$ ./build.sh
```


