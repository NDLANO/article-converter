
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import log from '../utils/logger';

function resolveJsonOrRejectWithImageObject(res) {
  return new Promise((resolve) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    log.warn(`Api call to ${res.url} failed with status ${res.status} ${res.statusText}`);
    return res.json()
      .then(json => log.logAndReturnValue('warn', 'JSON response from failed api call: ', json))
      .then(() => resolve(Object.assign({ images: { full: { url: `https://placeholdit.imgix.net/~text?txtsize=28&txt=${res.statusText}&w=1000&h=500` } } })));
  });
}

export const fetchFigureResources = (url, id, resource) => fetch(url).then(resolveJsonOrRejectWithImageObject).then(image => ({ id, url, resource, image }));
