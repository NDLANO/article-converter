/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { contributorTypes, contributorGroups, getLicenseByAbbreviation } from '@ndla/licenses';
import { resolveJsonOrRejectWithError } from '../utils/apiHelpers';
import config from '../config';
import { Author, PlainEmbed, LocaleType } from '../interfaces';
import { BrightcoveEmbedData, BrightcoveEmbed } from '../plugins/brightcovePlugin';

export interface BrightcoveVideo {
  id: string;
  custom_fields: Record<string, string>;
  name: string;
  published_at: string;
  description: string;
  long_description: string;
  link?: {
    text: string;
    url: string;
  };
}

export interface BrightcoveVideoSource {
  container?: string;
  size?: number;
  width?: number;
  height?: number;
  src: string;
}

export interface BrightcoveCopyright {
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
}

const getHeaders = (accessToken: AccessToken) => ({
  headers: {
    'content-type': 'Content-Type: application/json',
    Authorization: `Bearer ${accessToken.access_token}`,
  },
});

async function fetchVideoSources(
  videoId: string,
  accountId: string,
  accessToken: AccessToken,
): Promise<BrightcoveVideoSource[]> {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${
    `${videoId}`.split('&t=')[0]
  }/sources`;
  const response = await fetch(url, {
    method: 'GET',
    ...getHeaders(accessToken),
  });
  return resolveJsonOrRejectWithError<BrightcoveVideoSource[]>(response);
}

async function fetchVideo(
  videoId: string,
  accountId: string,
  accessToken: AccessToken,
): Promise<BrightcoveVideo> {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${
    `${videoId}`.split('&t=')[0]
  }`;
  const response = await fetch(url, {
    method: 'GET',
    ...getHeaders(accessToken),
  });
  return resolveJsonOrRejectWithError<BrightcoveVideo>(response);
}

const expiresIn = (accessToken: AccessToken) => accessToken.expires_in - 10;

const storeAccessToken = (accessToken: AccessToken) => {
  const expiresAt = expiresIn(accessToken) * 1000 + new Date().getTime();
  global.access_token = accessToken;
  global.access_token_expires_at = expiresAt;
};

async function fetchAccessToken(): Promise<AccessToken> {
  const base64Encode = (str: string) => Buffer.from(str).toString('base64');
  const url = 'https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials';
  const clientIdSecret = `${config.brightcoveClientId}:${config.brightcoveClientSecret}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Encode(clientIdSecret)}`,
    },
  });
  const accessToken = await resolveJsonOrRejectWithError<AccessToken>(response);

  storeAccessToken(accessToken);
  return accessToken;
}

const getAccessToken = async () => {
  if (global.access_token && new Date().getTime() < global.access_token_expires_at) {
    return global.access_token;
  }
  return fetchAccessToken();
};

// tmp solution for wrong contributorType in brightcove
const mapContributorType = (type: string) => {
  switch (type) {
    case 'Manus':
      return 'Manusforfatter';
    case 'Musikk':
      return 'Komponist';
    case 'Opphavsmann':
      return 'Opphaver';
    default:
      return type;
  }
};

const getLicenseByNBTitle = (title: string) => {
  switch (title.replace(/\s/g, '').toLowerCase()) {
    case 'navngivelse-ikkekommersiell-ingenbearbeidelse':
      return 'CC-BY-NC-ND-4.0';
    case 'navngivelse-ikkekommersiell-delpåsammevilkår':
      return 'CC-BY-NC-SA-4.0';
    case 'navngivelse-ikkekommersiell':
      return 'CC-BY-NC-4.0';
    case 'navngivelse-ingenbearbeidelse':
      return 'CC-BY-ND-4.0';
    case 'navngivelse-delpåsammevilkår':
      return 'CC-BY-SA-4.0';
    case 'navngivelse':
      return 'CC-BY-4.0';
    case 'offentligdomene':
      return 'PD';
    case 'publicdomaindedication':
      return 'CC0-1.0';
    case 'publicdomainmark':
      return 'PD';
    case 'fristatus-erklæring':
      return 'CC0-1.0';
    case 'opphavsrett':
      return 'COPYRIGHTED';
    default:
      return title;
  }
};

export const getContributorGroups = (fields: Record<string, string>) => {
  const parseContributorsString = (contributorString: string) => {
    const contributorFields = contributorString.split(/: */);
    if (contributorFields.length !== 2) return { type: '', name: contributorFields[0] };
    const [type, name] = contributorFields;
    const contributorType = Object.keys(contributorTypes.nb).find(
      (key) => contributorTypes.nb[key] === mapContributorType(type?.trim()),
    );
    return { type: contributorType || '', name };
  };

  const licenseInfoKeys = Object.keys(fields).filter((key) => key.startsWith('licenseinfo'));

  const contributors = licenseInfoKeys.map((key) => parseContributorsString(fields[key]));

  return contributors.reduce(
    (
      groups: { creators: Author[]; processors: Author[]; rightsholders: Author[] },
      contributor,
    ) => {
      const objectKeys = Object.keys(contributorGroups) as Array<keyof typeof contributorGroups>;
      const group = objectKeys.find((key) => {
        return contributorGroups[key].find((type) => type === contributor.type);
      });
      if (group) {
        return { ...groups, [group]: [...groups[group], contributor] };
      }
      return { ...groups, creators: [...groups.creators, contributor] };
    },
    {
      creators: [],
      processors: [],
      rightsholders: [],
    },
  );
};

export const fetchVideoMeta = async (
  embed: PlainEmbed<BrightcoveEmbedData>,
  locale: LocaleType,
): Promise<BrightcoveEmbed> => {
  const { videoid, account } = embed.data;
  const accessToken = await getAccessToken();
  const [video, sources] = await Promise.all([
    fetchVideo(videoid, account, accessToken),
    fetchVideoSources(videoid, account, accessToken),
  ]);
  const licenseCode = getLicenseByNBTitle(video.custom_fields.license);
  const license = getLicenseByAbbreviation(licenseCode, locale);

  const copyright: BrightcoveCopyright = {
    license: {
      license: licenseCode,
      description: license?.description,
      url: license?.url,
    },
    ...getContributorGroups(video.custom_fields),
  };
  return { ...embed, brightcove: { ...video, copyright, sources } };
};
