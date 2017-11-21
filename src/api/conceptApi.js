/**
 * Copyright (c) 2017-present, NDLA.
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

export const fetchConcept = (embed, accessToken, language, method = 'GET') => {
  const url = apiResourceUrl(
    `/article-api/v1/concepts/${embed.data.contentId}?language=${language}`
  );
  return fetch(url, {
    method,
    headers: headerWithAccessToken(accessToken),
  })
    .then(resolveJsonOrRejectWithError)
    .then(concept => ({ ...embed, concept }));
};
