/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import config from '../config';
import { createErrorPayload } from '../utils/errorHelpers';
import log from './logger';

const NDLA_API_URL = config.ndlaApiUrl;


const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }
  return NDLA_API_URL;
})();


export { apiBaseUrl };

export function apiResourceUrl(path) { return apiBaseUrl + path; }

export function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    log.warn(`Api call to ${res.url} failed with status ${res.status} ${res.statusText}`);
    return res.json()
      .then(json => log.logAndReturnValue('warn', 'JSON response from failed api call: ', json))
      .then(json => createErrorPayload(res.status, defined(json.message, res.statusText), json))
      .then(reject);
  });
}

export function headerWithAccessToken(accessToken) {
  return { Authorization: accessToken };
}
