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


var domain = function() {
  switch(process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost';
    case 'prod':
      return 'http://api.ndla.no';
    default:
      return 'http://api.' + process.env.NDLA_ENVIRONMENT + '.ndla.no'
  }
};

module.exports = Object.assign({
  host: process.env.ARTICLE_OEMBED_HOST || 'localhost',
  port: process.env.ARTICLE_OEMBED_PORT || '80',
  ndlaFrontendUrl: process.env.NDLA_FRONTEND_URL || domain + ':8082',
  ndlaApiUrl: process.env.NDLA_API_URL || domain,

  app: {
    title: 'NDLA Content frontend',
  },

}, environment);
