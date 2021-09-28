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
  options = {},
  method = 'GET'
) => {
  const endpoint = options.draftConcept ? 'drafts' : 'concepts';
  const url = apiResourceUrl(
    `/concept-api/v1/${endpoint}/${
      embed.data.contentId
    }?language=${language}&fallback=true`
  );
  const response = await fetch(url, {
    method,
    headers: headerWithAccessToken(accessToken),
  });
  const concept = await resolveJsonOrRejectWithError(response);
  return { ...embed, concept };
};
