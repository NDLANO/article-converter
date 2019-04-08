/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  apiResourceUrl,
  resolveJsonOrRejectWithError,
  headerWithAccessToken,
} from '../utils/apiHelpers';

export const fetchConcept = async (
  embed,
  accessToken,
  language,
  method = 'GET'
) => {
  const url = apiResourceUrl(
    `/concepts/api/v1/concept/${
      embed.data.contentId
    }?language=${language}&fallback=true`
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(accessToken),
  });
  const concept = await resolveJsonOrRejectWithError(response);
  return { ...embed, concept: concept && concept.data };
};
