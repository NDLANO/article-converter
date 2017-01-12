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
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost';
    case 'prod':
      return 'http://api.ndla.no';
    default:
      return `http://${process.env.NDLA_ENVIRONMENT}.api.ndla.no`;
  }
};

module.exports = Object.assign({
  host: process.env.ARTICLE_OEMBED_HOST || 'localhost',
  port: process.env.ARTICLE_OEMBED_PORT || '3001',
  ndlaApiUrl: process.env.NDLA_API_URL || domain(),
  ndlaApiKey: process.env.NDLA_API_KEY || 'ndlalearningpathfrontend',

  app: {
    title: 'NDLA Content frontend',
  },

}, environment);
