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
import { ApiOptions } from '../interfaces';

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
  contentId: string | number,
  apiOptions: ApiOptions,
  contentType: string,
): Promise<TaxonomyResourceQuery[]> {
  const versionHeader = apiOptions.versionHash ? { VersionHash: apiOptions.versionHash } : null;
  const headers = { ...headerWithAccessToken(apiOptions.accessToken), ...versionHeader };
  const response = await fetch(
    `${baseUrl}resources?contentURI=urn:${contentType}:${contentId}&language=${apiOptions.lang}`,
    {
      headers,
    },
  );
  return resolveJsonOrRejectWithError<TaxonomyResourceQuery[]>(response);
}

async function queryTopics(
  contentId: string | number,
  apiOptions: ApiOptions,
  contentType: string,
): Promise<TaxonomyTopicQuery[]> {
  const versionHeader = apiOptions.versionHash ? { VersionHash: apiOptions.versionHash } : null;
  const headers = { ...headerWithAccessToken(apiOptions.accessToken), ...versionHeader };
  const response = await fetch(
    `${baseUrl}topics?contentURI=urn:${contentType}:${contentId}&language=${apiOptions.lang}`,
    {
      headers,
    },
  );
  return resolveJsonOrRejectWithError<TaxonomyTopicQuery[]>(response);
}

export type ArticleResource =
  | TaxonomyResourceQuery
  | (TaxonomyTopicQuery & { resourceTypes: { id: string }[] });

export async function fetchArticleResource(
  contentId: string | number,
  apiOptions: ApiOptions,
  contentType: string = 'article',
): Promise<undefined | ArticleResource> {
  const resources = await queryResources(contentId, apiOptions, contentType);

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(contentId, apiOptions, contentType);

  const withPath = topics.find((t) => t.path);

  if (withPath) {
    // Add resourceType so that content type is correct
    return { ...withPath, resourceTypes: [{ id: 'subject' }] };
  }

  return undefined;
}
