/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { contributorTypes, contributorGroups } from '@ndla/licenses';
import { resolveJsonOrRejectWithError } from '../utils/apiHelpers';
import { brightcoveClientId, brightcoveClientSecret } from '../config';

const getHeaders = accessToken => ({
  headers: {
    'content-type': 'Content-Type: application/json',
    Authorization: `Bearer ${accessToken.access_token}`,
  },
});

async function fetchVideoSources(videoId, accountId, accessToken) {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/sources`;
  const response = await fetch(url, {
    method: 'GET',
    ...getHeaders(accessToken),
  });
  return resolveJsonOrRejectWithError(response);
}

async function fetchVideo(videoId, accountId, accessToken) {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}`;

  const response = await fetch(url, {
    method: 'GET',
    ...getHeaders(accessToken),
  });
  return resolveJsonOrRejectWithError(response);
}

const expiresIn = accessToken => accessToken.expires_in - 10;

const storeAccessToken = accessToken => {
  const expiresAt = expiresIn(accessToken) * 1000 + new Date().getTime();
  global.access_token = accessToken;
  global.access_token_expires_at = expiresAt;
};

async function fetchAccessToken() {
  const base64Encode = str => Buffer.from(str).toString('base64');
  const url =
    'https://oauth.brightcove.com/v4/access_token?grant_type=client_credentials';
  const clientIdSecret = `${brightcoveClientId}:${brightcoveClientSecret}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Encode(clientIdSecret)}`,
    },
  });
  const accessToken = await resolveJsonOrRejectWithError(response);

  storeAccessToken(accessToken);
  return accessToken;
}

const getAccessToken = async () => {
  if (
    global.access_token &&
    new Date().getTime() < global.access_token_expires_at
  ) {
    return global.access_token;
  }
  return fetchAccessToken();
};

const getLicenseByNBTitle = title => {
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
    case 'fristatus-erklæring':
      return 'CC0 1.0';
    case 'opphavsrett':
      return 'COPYRIGHTED';
    default:
      return title;
  }
};

export const getContributorGroups = fields => {
  const parseContributorsString = contributorString => {
    const contributorFields = contributorString.split(/: */);
    if (contributorFields.length !== 2)
      return { creators: { type: '', name: contributorFields[0] } };
    const [type, name] = contributorFields;
    const contributorType = Object.keys(contributorTypes.nb).find(
      key => contributorTypes.nb[key] === type
    );
    return { type: contributorType, name };
  };

  const licenseInfoKeys = Object.keys(fields).filter(key =>
    key.startsWith('licenseinfo')
  );

  const contributors = licenseInfoKeys.map(key =>
    parseContributorsString(fields[key])
  );

  return contributors.reduce(
    (groups, contributor) => {
      const group = Object.keys(contributorGroups).find(key =>
        contributorGroups[key].find(type => type === contributor.type)
      );
      if (group) {
        return { ...groups, [group]: [...groups[group], contributor] };
      }
      return { ...groups, creators: [...groups.creators, contributor] };
    },
    {
      creators: [],
      processors: [],
      rightsholders: [],
    }
  );
};

export const fetchVideoMeta = async embed => {
  const { videoid, account } = embed.data;
  const accessToken = await getAccessToken();
  const [video, sources] = await Promise.all([
    fetchVideo(videoid, account, accessToken),
    fetchVideoSources(videoid, account, accessToken),
  ]);

  const copyright = {
    license: {
      license: getLicenseByNBTitle(video.custom_fields.license),
    },
    ...getContributorGroups(video.custom_fields),
  };
  return { ...embed, brightcove: { ...video, copyright, sources } };
};
