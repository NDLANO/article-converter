/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { OembedEmbedType } from '../plugins/externalPlugin';
import { H5PEmbedType } from '../plugins/h5pPlugin';

export interface OembedProxyResponse {
  type: string;
  version: string;
  title?: string;
  description?: string;
  authorName?: string;
  authorUrl?: string;
  providerName?: string;
  providerUrl?: string;
  cacheAge?: number;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  width?: number;
  height?: number;
  html?: string;
}

export const fetchOembed = async (
  embed: OembedEmbedType | H5PEmbedType,
  accessToken: string,
): Promise<OembedEmbedType | H5PEmbedType> => {
  const url = new URL(typeof embed.data.url === 'string' ? embed.data.url : '');
  if (url.hostname.includes('youtu') && url.protocol === 'http:') {
    url.protocol = 'https:';
    embed.data.url = url.href;
  }
  const response = await fetch(
    apiResourceUrl(
      `/oembed-proxy/v1/oembed?${queryString.stringify({
        url: embed.data.url,
      })}`,
    ),
    {
      headers: headerWithAccessToken(accessToken),
    },
  );
  const oembed = await resolveJsonOrRejectWithError<OembedProxyResponse>(response);
  return {
    ...embed,
    oembed,
  };
};
