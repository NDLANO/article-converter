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

let H5P_HOST_URL = 'https://h5p.ndla.no'; // All environments uses prod except test.
if (process.env.NDLA_ENVIRONMENT === 'test') {
  H5P_HOST_URL = 'https://h5p-test.ndla.no';
} else if (process.env.NDLA_ENVIRONMENT === 'ff') {
  H5P_HOST_URL = 'https://h5p-ff.ndla.no';
}

module.exports = Object.assign(
  {
    host: process.env.ARTICLE_CONVERTER_HOST || 'localhost',
    port: process.env.ARTICLE_CONVERTER_PORT || '3100',
    ndlaApiUrl: process.env.NDLA_API_URL || domain(),
    ndlaApiKey: process.env.NDLA_API_KEY || 'ndlalearningpathfrontend',
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
