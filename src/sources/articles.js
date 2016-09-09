/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { apiResourceUrl, resolveJsonOrRejectWithError } from './helpers';

function resolveJsonOrRejectWithImageObject(res) {
  return new Promise((resolve) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res.json()
      .then(() => resolve(Object.assign({ images: { full: { url: `https://placeholdit.imgix.net/~text?txtsize=28&txt=${res.statusText}&w=1000&h=500` } } })));
  });
}

function fetchArticle(articleId, method = 'GET') {
  const url = apiResourceUrl(`/articles/${articleId}`);
  return fetch(url, { method }).then(resolveJsonOrRejectWithError);
}

const fetchFigureResources = (url, id, resource) => fetch(url).then(resolveJsonOrRejectWithImageObject).then((figure) => ({ id, url, resource, figure }));

export {
  fetchArticle,
  fetchFigureResources,
};
