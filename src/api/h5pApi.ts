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
import { H5pEmbedData } from '../plugins/h5pPlugin';
import { SimpleEmbedType } from '../interfaces';

const getHeaders = () => ({
  headers: {
    'content-type': 'Content-Type: application/json',
  },
});

export interface H5POembedResponse {
  html?: string;
}

export interface H5PLicenseInformation {
  h5p: {
    title: string;
    authors: {
      name: string;
      role: string;
    }[];
  };
}

export const fetchH5pLicenseInformation = async (
  id: string,
): Promise<H5PLicenseInformation | undefined> => {
  const url = `${config.h5pHost}/v1/resource/${id}/copyright`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getHeaders(),
    });
    return await resolveJsonOrRejectWithError<H5PLicenseInformation>(response);
  } catch (e) {
    return undefined;
  }
};

export interface OembedPreviewData {
  oembed: H5POembedResponse;
}

export const fetchPreviewOembed = async (
  embed: SimpleEmbedType<H5pEmbedData>,
  accessToken: string,
): Promise<OembedPreviewData> => {
  const url = `${config.h5pHost}/oembed/preview?${queryString.stringify({
    url: embed.data.url,
  })}`;
  const response = await fetch(url, {
    method: 'GET',
    ...headerWithAccessToken(accessToken),
    ...getHeaders(),
  });
  const oembed = await resolveJsonOrRejectWithError<H5POembedResponse>(response);

  return { oembed };
};
