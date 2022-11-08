/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../config';

const swaggerDefinition = {
  info: {
    title: 'NDLA Article converter',
    version: '0.0.1',
    description:
      'Article converter is an api for getting a extended html version of the content attribute provided by Article API', // Description (optional)
    termsOfService: 'https://ndla.no',
    contact: { name: 'hjelp+api@ndla.no' },
    license: {
      name: 'GPL v3.0',
      url: 'http://www.gnu.org/licenses/gpl-3.0.en.html',
    },
  },
  basePath: '/',
  securityDefinitions: {
    oauth2: {
      type: 'oauth2',
      description: '',
      flow: 'implicit',
      authorizationUrl: `https://${config.auth0Hostname}/authorize`,
    },
  },
};

export default swaggerDefinition;
