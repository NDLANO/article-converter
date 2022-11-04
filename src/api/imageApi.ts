/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { ApiOptions } from '../interfaces';
import {
  convertToInternalUrlIfPossible,
  headerWithAccessToken,
  resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';
import { ndlaFetch } from './ndlaFetch';

export const fetchImageResources = async (
  url: string,
  apiOptions: ApiOptions,
): Promise<IImageMetaInformationV2> => {
  const response = await ndlaFetch(
    `${convertToInternalUrlIfPossible(url)}?language=${apiOptions.lang}`,
    {
      headers: headerWithAccessToken(apiOptions.accessToken),
    },
  );
  const image = await resolveJsonOrRejectWithError<IImageMetaInformationV2>(response);
  return image;
};
