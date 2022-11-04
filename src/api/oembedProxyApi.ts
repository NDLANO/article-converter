/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';
import { OembedEmbedData } from '../plugins/externalPlugin';
import { H5pEmbedData } from '../plugins/h5pPlugin';
import { PlainEmbed } from '../interfaces';
import { ndlaFetch } from './ndlaFetch';

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

export interface OembedProxyData {
  oembed: OembedProxyResponse;
  url?: string;
}

export const fetchOembed = async (
  embed: PlainEmbed<H5pEmbedData | OembedEmbedData>,
  accessToken: string,
): Promise<OembedProxyData> => {
  const url = new URL(typeof embed.data.url === 'string' ? embed.data.url : '');
  let newUrl;
  if (url.hostname.includes('youtu') && url.protocol === 'http:') {
    url.protocol = 'https:';
    newUrl = url.href;
  }
  const response = await ndlaFetch(
    apiResourceUrl(
      `/oembed-proxy/v1/oembed?${queryString.stringify({
        url: newUrl || embed.data.url,
      })}`,
    ),
    {
      headers: headerWithAccessToken(accessToken),
    },
  );
  const oembed = await resolveJsonOrRejectWithError<OembedProxyResponse>(response);
  return {
    oembed,
    url: newUrl,
  };
};
