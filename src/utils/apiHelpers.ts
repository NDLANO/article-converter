/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import config from '../config';
import { createErrorPayload } from './errorHelpers';
import log from './logger';

const NDLA_API_URL = config.ndlaApiUrl;

const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }
  return NDLA_API_URL;
})();

export function convertToInternalUrlIfPossible(url: string) {
  return url.replace(/^https:\/\/(?!www)(.*?)api(.+?)ndla\.no/g, apiBaseUrl);
}

export { apiBaseUrl };

export function apiResourceUrl(path: string) {
  return apiBaseUrl + path;
}

export function rejectWithError(json: any, res: Response) {
  log.logAndReturnValue('warn', 'JSON response from failed api call: ', json);
  return createErrorPayload(
    res.status,
    defined(json.message, res.statusText),
    json
  );
}

export async function resolveJsonOrRejectWithError(res: Response) {
  if (res.ok) {
    return res.status === 204 ? undefined : res.json();
  }
  if (res.status === 404) {
    throw createErrorPayload(res.status, res.statusText);
  }
  log.warn(
    `Api call to ${res.url} failed with status ${res.status} ${res.statusText}`
  );
  const json = await res.json();
  throw rejectWithError(json, res);
}

export function headerWithAccessToken(accessToken: string) {
  return {
    Authorization: accessToken,
  };
}
