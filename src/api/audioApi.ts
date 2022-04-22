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
import { ApiOptions, Author, PlainEmbed } from '../interfaces';
import { AudioEmbedData, AudioEmbed } from '../plugins/audioPlugin';

export interface AudioApiCopyright {
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  origin?: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

export interface AudioApiType {
  id: number;
  revision: number;
  title: {
    title: string;
    language: string;
  };
  audioFile: {
    url: string;
    mimeType: string;
    fileSize: number;
    language: string;
  };
  copyright: AudioApiCopyright;
  tags: {
    tags: string[];
    language: string;
  };
  supportedLanguages: string[];
  audioType: string;
  podcastMeta?: {
    introduction: string;
    coverPhoto: {
      id: string;
      url: string;
      altText: string;
    };
    language: string;
  };
  series?: {
    id: number;
    revision: number;
    title: {
      title: string;
      language: string;
    };
    description: {
      description: string;
      language: string;
    };
    coverPhoto: {
      id: string;
      url: string;
      altText: string;
    };
    episodes?: AudioApiType[];
    supportedLanguages: string[];
  };
  manuscript?: {
    manuscript: string;
    language: string;
  };
  created: string;
  updated: string;
}

export const fetchAudio = (
  embed: PlainEmbed<AudioEmbedData>,
  apiOptions: ApiOptions,
): Promise<AudioEmbed> => {
  const url = typeof embed.data.url === 'string' ? embed.data.url : '';
  return fetch(`${convertToInternalUrlIfPossible(url)}?language=${apiOptions.lang}`, {
    headers: headerWithAccessToken(apiOptions.accessToken),
  })
    .then((res) => resolveJsonOrRejectWithError<AudioApiType>(res))
    .then((audio) => ({ ...embed, audio }));
};
