/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
  convertToInternalUrlIfPossible,
} from '../utils/apiHelpers';

export const fetchAudio = (embed, accessToken) =>
  fetch(convertToInternalUrlIfPossible(embed.data.url), {
    headers: headerWithAccessToken(accessToken),
  })
    .then(resolveJsonOrRejectWithError)
    .then(audio => ({ ...embed, audio }));
