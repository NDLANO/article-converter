/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleV2 } from '@ndla/types-article-api';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { ApiOptions, ResponseHeaders } from '../interfaces';
import { ndlaFetch } from './ndlaFetch';

export async function fetchArticle(
  articleId: number | string,
  apiOptions: ApiOptions,
): Promise<{ article: IArticleV2; responseHeaders: ResponseHeaders }> {
  const feideHeader = apiOptions.feideToken ? { FeideAuthorization: apiOptions.feideToken } : null;
  const headers = { ...headerWithAccessToken(apiOptions.accessToken), ...feideHeader };
  const url = apiResourceUrl(
    `/article-api/v2/articles/${articleId}?language=${apiOptions.lang}&fallback=true`,
  );
  const response = await ndlaFetch(url, {
    method: 'GET',
    headers,
  });

  const cacheControlResponse = response.headers.get('cache-control');
  const responseHeaders: Record<string, string> = cacheControlResponse
    ? { 'cache-control': cacheControlResponse }
    : {};

  const article = resolveJsonOrRejectWithError<IArticleV2>(response);
  return article.then((article) => ({ article, responseHeaders }));
}
