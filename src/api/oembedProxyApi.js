/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { apiResourceUrl, resolveJsonOrRejectWithError } from '../utils/apiHelpers';
import { ndlaApiKey } from '../config';

export const fetchOembed = embed =>
  fetch(apiResourceUrl(`/oembed?url=${embed.url}`), { headers: { 'APP-KEY': ndlaApiKey } })
    .then(resolveJsonOrRejectWithError)
    .then(oembed => ({ ...embed, oembed }))
    .catch((e) => {
      if (e.status === 501 && e.json.code === 'PROVIDER_NOT_SUPPORTED') {
        return { ...embed, message: `Uhåndtert embed med følgende url: ${embed.url}`, resource: 'error' };
      }
      return { ...embed, message: `En uventet feil oppsto med følgende embed url: ${embed.url}`, resource: 'unhandled-oembed-error' };
    });
