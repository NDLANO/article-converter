/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  headerWithAccessToken,
  resolveJsonOrRejectWithError,
  convertToInternalUrlIfPossible,
} from '../utils/apiHelpers';

export const fetchImageResources = async (embed, accessToken, language) => {
  const response = await fetch(
    `${convertToInternalUrlIfPossible(embed.data.url)}?language=${language}`,
    {
      headers: headerWithAccessToken(accessToken),
    }
  );
  const image = await resolveJsonOrRejectWithError(response);
  return { ...embed, image };
};
