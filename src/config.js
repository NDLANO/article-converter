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
  host: process.env.CONTENT_FRONTEND_HOST || 'localhost',
  port: process.env.CONTENT_FRONTEND_PORT || '3000',
  ndlaContentApiUrl: process.env.NDLA_API_URL || 'http://api.test.ndla.no',

  app: {
    title: 'NDLA Content frontend',
  },

}, environment);
