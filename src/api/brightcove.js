/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError } from '../utils/apiHelpers';
import { brightcoveClientId, brightcoveClientSecret } from '../config';

function fetchVideo(videoId, accountId, accessToken) {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'Content-Type: application/json',
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  });
}

function getAccessToken() {
  const base64Encode = str => new Buffer(str).toString('base64');
  const url =
    'https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials';
  const clientIdSecret = `${brightcoveClientId}:${brightcoveClientSecret}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Encode(clientIdSecret)}`,
    },
  }).then(resolveJsonOrRejectWithError);
}

export const fetchVideoMeta = embed =>
  getAccessToken()
    .then(accessToken => fetchVideo(embed.videoid, embed.account, accessToken))
    .then(resolveJsonOrRejectWithError)
    .then(video => ({ ...embed, video }));
