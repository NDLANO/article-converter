/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Logger from 'bunyan';
import config from '../config';
import { createErrorPayload } from './errorHelpers';
import getLogger from './logger';

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

export function rejectWithError(log: Logger, json: any, res: Response) {
  log.warn('JSON response from failed api call:', json);
  return createErrorPayload(res.status, json.message ?? res.statusText, json);
}

export async function resolveJsonOrRejectWithError<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.status === 204 ? undefined : res.json();
  }
  if (res.status === 404) {
    throw createErrorPayload(res.status, res.statusText);
  }
  const log = getLogger();
  log.warn(`Api call to ${res.url} failed with status ${res.status} ${res.statusText}`);
  const json = await res.json();
  throw rejectWithError(log, json, res);
}

export function headerWithAccessToken(accessToken: string) {
  return {
    Authorization: accessToken,
  };
}
