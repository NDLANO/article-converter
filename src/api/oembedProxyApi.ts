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

export const fetchOembed = async (embed, accessToken, options = {}) => {
  const url = new URL(embed.data.url);
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
  const oembed = await resolveJsonOrRejectWithError(response);
  return {
    ...embed,
    oembed,
  };
};
