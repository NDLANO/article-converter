/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { IArticleV2 } from '@ndla/types-article-api';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { LocaleType, ResponseHeaders } from '../interfaces';

export async function fetchArticle(
  articleId: number | string,
  accessToken: string,
  feideToken: string,
  language: LocaleType,
): Promise<[IArticleV2, ResponseHeaders]> {
  const feideHeader = feideToken ? { FeideAuthorization: feideToken } : null;
  const headers = { ...headerWithAccessToken(accessToken), ...feideHeader };
  const response = await fetch(
    apiResourceUrl(`/article-api/v2/articles/${articleId}?language=${language}&fallback=true`),
    {
      method: 'GET',
      headers,
    },
  );

  const cacheControlResponse = response.headers.get('cache-control');
  const responseHeaders: Record<string, string> = cacheControlResponse
    ? { 'cache-control': cacheControlResponse }
    : {};

  const article = resolveJsonOrRejectWithError<IArticleV2>(response);
  return article.then((art) => [art, responseHeaders]);
}
