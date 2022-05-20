/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { IConcept, IConceptSearchResult } from '@ndla/types-concept-api';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { ApiOptions, PlainEmbed } from '../interfaces';
import { ConceptEmbedData, ConceptEmbed } from '../plugins/conceptPlugin';
import { ConceptListEmbed, ConceptListEmbedData } from '../plugins/conceptListPlugin';

export const fetchConcept = async (
  embed: PlainEmbed<ConceptEmbedData>,
  apiOptions: ApiOptions,
  options: {
    draftConcept?: boolean;
  } = {},
  method: string = 'GET',
): Promise<ConceptEmbed> => {
  const endpoint = options.draftConcept ? 'drafts' : 'concepts';
  const url = apiResourceUrl(
    `/concept-api/v1/${endpoint}/${embed.data.contentId}?language=${apiOptions.lang}&fallback=true`,
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(apiOptions.accessToken),
  });

  const cacheControlResponse = response.headers.get('cache-control');
  const responseHeaders: Record<string, string> = cacheControlResponse
    ? { 'cache-control': cacheControlResponse }
    : {};

  const concept = await resolveJsonOrRejectWithError<IConcept>(response);
  return { ...embed, concept, responseHeaders };
};

export const fetchConcepts = async (
  embed: PlainEmbed<ConceptListEmbedData>,
  apiOptions: ApiOptions,
  method: string = 'GET',
): Promise<ConceptListEmbed> => {
  const url = apiResourceUrl(
    `/concept-api/v1/concepts/?tags=${embed.data.tag}&language=${apiOptions.lang}&page-size=1000`,
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(apiOptions.accessToken),
  });

  const cacheControlResponse = response.headers.get('cache-control');
  const responseHeaders: Record<string, string> = cacheControlResponse
    ? { 'cache-control': cacheControlResponse }
    : {};

  const result = await resolveJsonOrRejectWithError<IConceptSearchResult>(response);
  return { ...embed, concepts: result.results, responseHeaders };
};
