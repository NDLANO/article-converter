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

async function queryResources(contentId, accessToken, language, contentType) {
  const response = await fetch(
    `${baseUrl}resources?contentURI=urn:${contentType}:${contentId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    }
  );
  return resolveJsonOrRejectWithError(response);
}

async function queryTopics(contentId, accessToken, language, contentType) {
  const response = await fetch(
    `${baseUrl}topics?contentURI=urn:${contentType}:${contentId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    }
  );
  return resolveJsonOrRejectWithError(response);
}

export async function fetchArticleResource(
  contentId,
  accessToken,
  language,
  contentType = 'article'
) {
  const resources = await queryResources(
    contentId,
    accessToken,
    language,
    contentType
  );

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(
    contentId,
    accessToken,
    language,
    contentType
  );

  const withPath = topics.filter(t => t.path !== null);

  if (withPath[0]) {
    // Add resourceType so that content type is correct
    return { ...withPath[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}
