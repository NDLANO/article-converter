/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IAudioMetaInformation } from '@ndla/types-audio-api';
import fetch from 'isomorphic-fetch';
import { ApiOptions, PlainEmbed } from '../interfaces';
import { AudioEmbed, AudioEmbedData } from '../plugins/audioPlugin';
import {
  convertToInternalUrlIfPossible,
  headerWithAccessToken,
  resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';

export const fetchAudio = (
  embed: PlainEmbed<AudioEmbedData>,
  apiOptions: ApiOptions,
): Promise<AudioEmbed> => {
  const url = typeof embed.data.url === 'string' ? embed.data.url : '';
  return fetch(`${convertToInternalUrlIfPossible(url)}?language=${apiOptions.lang}`, {
    headers: headerWithAccessToken(apiOptions.accessToken),
  })
    .then((res) => resolveJsonOrRejectWithError<IAudioMetaInformation>(res))
    .then((audio) => ({ ...embed, audio }));
};
