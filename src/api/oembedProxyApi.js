/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import createErrorPlugin from '../plugins/errorPlugin';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';

export const fetchOembed = (embed, accessToken) =>
  fetch(apiResourceUrl(`/oembed-proxy/v1/oembed?url=${embed.data.url}`), {
    headers: headerWithAccessToken(accessToken),
  })
    .then(resolveJsonOrRejectWithError)
    .then(oembed => ({ ...embed, oembed }))
    .catch(e => {
      const plugin = createErrorPlugin();
      if (e.status === 501 && e.json.code === 'PROVIDER_NOT_SUPPORTED') {
        return {
          ...embed,
          plugin,
          data: {
            message: `Uhåndtert embed med følgende url: ${embed.data.url}`,
          },
          resource: 'error',
        };
      }
      return {
        ...embed,
        plugin,
        data: {
          message: `En uventet feil oppsto med følgende embed url: ${
            embed.data.url
          }`,
        },
        resource: 'error',
      };
    });
