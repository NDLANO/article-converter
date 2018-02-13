/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
  rejectWithError,
} from '../utils/apiHelpers';

export async function fetchArticle(articleId, accessToken, language) {
  const fetchit = async lang =>
    fetch(
      apiResourceUrl(`/article-api/v2/articles/${articleId}?language=${lang}`),
      {
        method: 'GET',
        headers: headerWithAccessToken(accessToken),
      }
    );

  let response = await fetchit(language);
  if (response.status === 404) {
    const json = await response.json();
    if (json.supportedLanguages) {
      response = await fetchit(json.supportedLanguages[0]);
    } else {
      throw rejectWithError(json, response);
    }
  }
  return resolveJsonOrRejectWithError(response);
}
