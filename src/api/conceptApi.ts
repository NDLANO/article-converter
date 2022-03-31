/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { IConcept } from '@ndla/types-concept-api';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { LocaleType, PlainEmbed } from '../interfaces';
import { ConceptEmbedData, ConceptEmbed } from '../plugins/conceptPlugin';

export const fetchConcept = async (
  embed: PlainEmbed<ConceptEmbedData>,
  accessToken: string,
  language: LocaleType,
  options: {
    draftConcept?: boolean;
  } = {},
  method: string = 'GET',
): Promise<ConceptEmbed> => {
  const endpoint = options.draftConcept ? 'drafts' : 'concepts';
  const url = apiResourceUrl(
    `/concept-api/v1/${endpoint}/${embed.data.contentId}?language=${language}&fallback=true`,
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(accessToken),
  });

  const cacheControlResponse = response.headers.get('cache-control');
  const responseHeaders: Record<string, string> = cacheControlResponse
    ? { 'cache-control': cacheControlResponse }
    : {};

  const concept = await resolveJsonOrRejectWithError<IConcept>(response);
  return { ...embed, concept, responseHeaders };
};
