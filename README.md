# NDLA article-converter

![CI](https://github.com/NDLANO/article-converter/workflows/CI/badge.svg)

One of several apis powering [https://ndla.no](https://ndla.no).

Norwegian Digital Learning Arena (NDLA) (Norwegian: Nasjonal digital læringsarena) is a joint county enterprise offering [open digital learning assets](https://en.wikipedia.org/wiki/Digital_learning_assets) for upper secondary education. In addition to being a compilation of [open educational resources (OER)](https://en.wikipedia.org/wiki/Open_educational_resources), NDLA provides a range of other online tools for sharing and cooperation.

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

- Node.JS ~10
- npm ~6
- Yarn ~1.1
- Docker (optional)

### Getting started

#### Dependencies

All dependencies are defined in `package.json` and are managed with yarn/npm. To
initially install all dependencies and when the list dependency has changed,
run `yarn`.

### Start development server

Start node server with hot reloading middleware listening on port 3000.

`$ yarn start`

To use a different api set the `NDLA_API_URL` environment variable.

To use article-converter in local ndla-frontend you have to run graphql-api and ndla-frontend locally with special commands.

In graphql-api:
`yarn start-with-local-converter`

In ndla-frontend:
`yarn start-with-local-graphql-and-article-converter`

#### Unit tests

Test framework: jest.

`$ yarn test`

Do you tdd?

`$ yarn tdd`

### Code style

[Prettier](https://prettier.io/) is used for automatic code formatting.

`yarn format`

`yarn format-check`

### Linting

Eslint is used for linting.

`yarn lint-es`

Rules are configured in `./eslintrc` and extends [esling-config-ndla](https://github.com/NDLANO/frontend-packages/tree/master/packages/eslint-config-ndla).

#### Other scripts

```sh
# GTG? Checks code formating, linting and runs unit tests:
yarn check-all
```

```sh
# Run with NODE_ENV=production:
npm yarn start-prod
```

```sh
# Docker stuff
./build.sh
```
