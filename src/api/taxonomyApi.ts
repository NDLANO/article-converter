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
import { LocaleType } from '../interfaces';

const baseUrl = apiResourceUrl(`/taxonomy/v1/`);

interface TaxonomyMetadata {
  grepCodes: string[];
  visible: boolean;
  customFields: Record<string, string>;
}

interface TaxonomyResourceQuery {
  id: string;
  name: string;
  contentUri: string;
  path?: string | null;
  paths?: string[] | null;
  metadata?: TaxonomyMetadata;
  resourceTypes: {
    id: string;
    name: string;
    parentId: string;
    connectionId: string;
  }[];
}

interface TaxonomyTopicQuery {
  id: string;
  name: string;
  contentUri: string;
  path?: string | null;
  paths?: string[] | null;
  metadata?: TaxonomyMetadata;
  relevanceId: string;
}

async function queryResources(
  contentId: string,
  accessToken: string,
  language: LocaleType,
  contentType: string,
): Promise<TaxonomyResourceQuery[]> {
  const response = await fetch(
    `${baseUrl}resources?contentURI=urn:${contentType}:${contentId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    },
  );
  return resolveJsonOrRejectWithError<TaxonomyResourceQuery[]>(response);
}

async function queryTopics(
  contentId: string,
  accessToken: string,
  language: LocaleType,
  contentType: string,
): Promise<TaxonomyTopicQuery[]> {
  const response = await fetch(
    `${baseUrl}topics?contentURI=urn:${contentType}:${contentId}&language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    },
  );
  return resolveJsonOrRejectWithError<TaxonomyTopicQuery[]>(response);
}

export async function fetchArticleResource(
  contentId: string,
  accessToken: string,
  language: LocaleType,
  contentType: string = 'article',
) {
  const resources = await queryResources(contentId, accessToken, language, contentType);

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(contentId, accessToken, language, contentType);

  const withPath = topics.filter((t) => t.path !== null);

  if (withPath[0]) {
    // Add resourceType so that content type is correct
    return { ...withPath[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}
