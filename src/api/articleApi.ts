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

export interface Author {
  name: string;
  type: string;
}

export interface ArticleApiCopyright {
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  origin: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

type RelatedContent =
  | number
  | {
      title: string;
      url: string;
    };

export interface ArticleApiArticle {
  id: number;
  oldNdlaUrl?: string;
  revision: number;
  title: {
    title: string;
    language: string;
  };
  content: {
    content: string;
    language: string;
  };
  copyright: ArticleApiCopyright;
  tags: {
    tags: string[];
    language: string;
  };
  requiredLibraries: {
    mediaType: string;
    name: string;
    url: string;
  }[];
  visualElement?: {
    visualElement: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  introduction?: {
    introduction: string;
    language: string;
  };
  metaDescription: {
    metaDescription: string;
    language: string;
  };
  created: string;
  updated: string;
  updatedBy: string;
  published: string;
  articleType: string;
  supportedLanguages: string[];
  grepCodes: string[];
  conceptIds: number[];
  availability: string;
  relatedContent: RelatedContent[];
}

export async function fetchArticle(
  articleId: number | string,
  accessToken: string,
  language: LocaleType
): Promise<ArticleApiArticle> {
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
