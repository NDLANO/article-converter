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
    .then(oembed => ({ ...embed, oembed }));
