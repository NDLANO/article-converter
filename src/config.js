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

module.exports = Object.assign({
  host: process.env.ARTICLE_OEMBED_HOST || 'localhost',
  port: process.env.ARTICLE_OEMBED_PORT || '3000',
  ndlaFrontendUrl: process.env.NDLA_FRONTEND_URL || 'http://api.test.ndla.no:8082',
  ndlaApiUrl: process.env.NDLA_API_URL || 'http://api.test.ndla.no',

  app: {
    title: 'NDLA Content frontend',
  },

}, environment);
