/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import { h5pHost } from '../config.js';

import {
  headerWithAccessToken,
  resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';

const getHeaders = () => ({
  headers: {
    'content-type': 'Content-Type: application/json',
  },
});

export const fetchH5pLicenseInformation = async id => {
  const url = `${h5pHost}/v1/resource/${id}/copyright`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getHeaders(),
    });
    return await resolveJsonOrRejectWithError(response);
  } catch (e) {
    return null;
  }
};

export const fetchPreviewOembed = async (embed, accessToken, options = {}) => {
  const url = `${h5pHost}/oembed/preview?${queryString.stringify({
    url: embed.data.url,
  })}`;
  const response = await fetch(url, {
    method: 'GET',
    ...headerWithAccessToken(accessToken),
    ...getHeaders(),
  });
  const oembed = await resolveJsonOrRejectWithError(response);
  return {
    ...embed,
    oembed,
  };
};
