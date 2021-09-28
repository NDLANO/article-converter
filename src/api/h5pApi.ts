/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import config from '../config';

import { headerWithAccessToken, resolveJsonOrRejectWithError } from '../utils/apiHelpers';
import { EmbedType } from '../interfaces';

const getHeaders = () => ({
  headers: {
    'content-type': 'Content-Type: application/json',
  },
});

export const fetchH5pLicenseInformation = async (id: string) => {
  const url = `${config.h5pHost}/v1/resource/${id}/copyright`;
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

export const fetchPreviewOembed = async (embed: EmbedType, accessToken: string) => {
  const url = `${config.h5pHost}/oembed/preview?${queryString.stringify({
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
