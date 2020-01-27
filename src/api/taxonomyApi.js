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

async function queryResources(articleId, accessToken, language, contentType) {
  const response = await fetch(
    `${baseUrl}queries/resources?contentURI=urn:${contentType}:${articleId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    }
  );
  return resolveJsonOrRejectWithError(response);
}

async function queryTopics(articleId, accessToken, language, contentType) {
  const response = await fetch(
    `${baseUrl}queries/topics?contentURI=urn:${contentType}:${articleId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    }
  );
  return resolveJsonOrRejectWithError(response);
}

export async function fetchArticleResource(
  articleId,
  accessToken,
  language,
  contentType = 'article'
) {
  const resources = await queryResources(
    articleId,
    accessToken,
    language,
    contentType
  );

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(
    articleId,
    accessToken,
    language,
    contentType
  );

  if (topics[0]) {
    // Add resourceType so that content type is correct
    return { ...topics[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}
