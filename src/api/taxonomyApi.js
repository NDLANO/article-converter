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

const baseUrl = apiResourceUrl(`/taxonomy/v1/`);

export async function fetchArticleResource(
  articleId,
  accessToken,
  language,
  method = 'GET'
) {
  const response = await fetch(
    `${baseUrl}queries/resources?contentURI=urn:article:${articleId}`,
    {
      method,
      headers: headerWithAccessToken(accessToken),
    }
  );
  const resources = await resolveJsonOrRejectWithError(response);
  return resources[0]; // return first if more then one hit
}
