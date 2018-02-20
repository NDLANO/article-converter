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
} from '../utils/apiHelpers';

export async function fetchArticle(articleId, accessToken, language) {
  const response = await fetch(
    apiResourceUrl(
      `/article-api/v2/articles/${articleId}?language=${language}&fallback=true`
    ),
    {
      method: 'GET',
      headers: headerWithAccessToken(accessToken),
    }
  );
  return resolveJsonOrRejectWithError(response);
}
