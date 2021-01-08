/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

const domain = () => {
  const apiHost = process.env.API_GATEWAY_HOST;
  if (!apiHost) {
    if (!process.env.NDLA_ENVIRONMENT) {
      return 'https://test.api.ndla.no'; // Defaults to test if undefined
    }

    switch (process.env.NDLA_ENVIRONMENT) {
      case 'local':
        return 'http://api-gateway.ndla-local';
      case 'prod':
        return 'https://api.ndla.no';
      default:
        return `https://${process.env.NDLA_ENVIRONMENT.replace(
          '_',
          '-'
        )}.api.ndla.no`;
    }
  } else {
    return `http://${apiHost}`;
  }
};

const getAuth0Hostname = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'prod':
      return 'ndla.eu.auth0.com';
    case 'ff':
      return 'ndla.eu.auth0.com';
    case 'staging':
      return 'ndla-staging.eu.auth0.com';
    default:
      return 'ndla-test.eu.auth0.com';
  }
};

const listeDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:30020';
    case 'prod':
      return 'https://liste.ndla.no';
    default:
      return `https://liste.${process.env.NDLA_ENVIRONMENT}.ndla.no`;
  }
};

const ndlaFrontendDomain = () => {
  console.log('env,', process.env.NDLA_ENVIRONMENT);
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:30017';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://${process.env.NDLA_ENVIRONMENT}.ndla.no`;
  }
};

let H5P_HOST_URL = 'https://h5p.ndla.no'; // All environments uses prod except test.
if (process.env.NDLA_ENVIRONMENT === 'test') {
  H5P_HOST_URL = 'https://h5p-test.ndla.no';
} else if (process.env.NDLA_ENVIRONMENT === 'staging') {
  H5P_HOST_URL = 'https://h5p-staging.ndla.no';
}

module.exports = Object.assign(
  {
    host: process.env.ARTICLE_CONVERTER_HOST || 'localhost',
    port: process.env.ARTICLE_CONVERTER_PORT || '3100',
    listingFrontendDomain: listeDomain(),
    ndlaApiUrl: process.env.NDLA_API_URL || domain(),
    ndlaApiKey: process.env.NDLA_API_KEY || 'ndlalearningpathfrontend',
    ndlaFrontendDomain: ndlaFrontendDomain(),
    brightcoveClientId: process.env.BRIGHTCOVE_API_CLIENT_ID || '',
    brightcoveClientSecret: process.env.BRIGHTCOVE_API_CLIENT_SECRET || '',
    auth0Hostname: getAuth0Hostname(),
    h5pHost: H5P_HOST_URL,

    app: {
      title: 'NDLA Content frontend',
    },
  },
  environment
);
