/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResponseHeaders } from '../interfaces';

export function mergeResponseHeaders(respHeaders: ResponseHeaders[]): ResponseHeaders {
  // List of cache-control response header directives in order of which "wins"
  // IE: The most restrictive ones will always win
  const cacheControlStrictness = [
    'public',
    'must-revalidate',
    'proxy-revalidate',
    'private',
    'no-cache',
    'no-store',
  ];

  const headers: Record<string, string> = {};

  respHeaders.forEach((embed) => {
    Object.entries(embed ?? {}).forEach(([key, value]) => {
      switch (key.toLowerCase()) {
        case 'cache-control':
          {
            const storedHeader: string | undefined = headers['cache-control'];
            const storedIdx = cacheControlStrictness.findIndex((x) => storedHeader?.includes(x));
            const newIdx = cacheControlStrictness.findIndex((x) => value.includes(x));
            if (newIdx > storedIdx) {
              headers['cache-control'] = value;
            }
          }
          break;
        default:
          headers[key] = value;
      }
    });
  });

  return headers;
}
