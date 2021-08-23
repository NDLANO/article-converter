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

const apiUrl = () => {
  const apiUrl = process.env.API_GATEWAY_HOST;
  if (!apiUrl) {
    if (!process.env.NDLA_ENVIRONMENT) {
      return 'https://api.test.ndla.no'; // Defaults to test if undefined
    }
    switch (process.env.NDLA_ENVIRONMENT) {
      case 'local':
        return 'http://api-gateway.ndla-local';
      case 'prod':
        return 'https://api.ndla.no';
      default:
        return `https://api.${process.env.NDLA_ENVIRONMENT.replace(
          '_',
          '-'
        )}.ndla.no`;
    }
  } else {
    return `http://${apiUrl}`;
  }
};

const auth0Hostname = () => {
  const auth0Hostname = process.env.AUTH0_HOSTNAME;
  if (!auth0Hostname) {
    switch (process.env.NDLA_ENVIRONMENT) {
      case 'prod':
        return 'ndla.eu.auth0.com';
      case 'staging':
        return 'ndla-staging.eu.auth0.com';
      default:
        return 'ndla-test.eu.auth0.com';
    }
  } else {
    return auth0Hostname;
  }
};

const listingFrontendDomain = () => {
  const listingDomain = process.env.LISTING_DOMAIN;
  if (!listingDomain) {
    switch (process.env.NDLA_ENVIRONMENT) {
      case 'local':
        return 'http://localhost:30020';
      case 'prod':
        return 'https://liste.ndla.no';
      default:
        return `https://liste.${process.env.NDLA_ENVIRONMENT}.ndla.no`;
    }
  } else {
    return listingDomain;
  }
};

const ndlaFrontendDomain = () => {
  const frontendDomain = process.env.FRONTEND_DOMAIN;
  if (!frontendDomain) {
    switch (process.env.NDLA_ENVIRONMENT) {
      case 'local':
        return 'http://localhost:30017';
      case 'prod':
        return 'https://ndla.no';
      default:
        return `https://${process.env.NDLA_ENVIRONMENT || 'test'}.ndla.no`;
    }
  } else {
    return frontendDomain;
  }
};

const h5pHostUrl = () => {
  const h5pHost = process.env.H5P_HOST;
  if (!h5pHost) {
    switch (process.env.NDLA_ENVIRONMENT) {
      case 'prod':
        return 'https://h5p.ndla.no';
      default:
        return `https://h5p-${process.env.NDLA_ENVIRONMENT || 'test'}.ndla.no`;
    }
  } else {
    return h5pHost;
  }
};

module.exports = Object.assign(
  {
    host: process.env.ARTICLE_CONVERTER_HOST || 'localhost',
    port: process.env.ARTICLE_CONVERTER_PORT || '3100',
    listingFrontendDomain: listingFrontendDomain(),
    ndlaApiUrl: process.env.NDLA_API_URL || apiUrl(),
    ndlaApiKey: process.env.NDLA_API_KEY || 'ndlalearningpathfrontend',
    ndlaFrontendDomain: ndlaFrontendDomain(),
    brightcoveClientId: process.env.BRIGHTCOVE_API_CLIENT_ID || '',
    brightcoveClientSecret: process.env.BRIGHTCOVE_API_CLIENT_SECRET || '',
    auth0Hostname: auth0Hostname(),
    h5pHost: h5pHostUrl(),

    app: {
      title: 'NDLA article converter',
    },
  },
  environment
);
