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
import { Author, EmbedType, LocaleType } from '../interfaces';
import { ConceptEmbedType } from '../plugins/conceptPlugin';

export interface ConceptCopyright {
  license?: {
    license: string;
    description?: string;
    url?: string;
  };
  origin?: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

export interface ConceptApiType {
  id: number;
  revision: number;
  title?: {
    title: string;
    language: string;
  };
  content?: {
    content: string;
    language: string;
  };
  copyright?: ConceptCopyright;
  source?: string;
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  tags?: {
    tags: string[];
    language: string;
  };
  subjectIds?: string[];
  created: string;
  updated: string;
  updatedBy?: string[];
  supportedLanguages?: string;
  articleIds: number[];
  status: {
    current: string;
    other: string[];
  };
  visualElement?: {
    visualElement: string;
    language: string;
  };
}

export const fetchConcept = async (
  embed: EmbedType,
  accessToken: string,
  language: LocaleType,
  options: {
    draftConcept?: boolean;
  } = {},
  method: string = 'GET',
): Promise<ConceptEmbedType> => {
  const endpoint = options.draftConcept ? 'drafts' : 'concepts';
  const url = apiResourceUrl(
    `/concept-api/v1/${endpoint}/${embed.data.contentId}?language=${language}&fallback=true`,
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(accessToken),
  });

  const concept = await resolveJsonOrRejectWithError<ConceptApiType>(response);
  return { ...embed, concept };
};
