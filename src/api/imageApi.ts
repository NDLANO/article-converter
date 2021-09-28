/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  headerWithAccessToken,
  resolveJsonOrRejectWithError,
  convertToInternalUrlIfPossible,
} from '../utils/apiHelpers';
import { Author, EmbedType, LocaleType } from '../interfaces';

interface ImageApiCopyright {
  license: {
    license: string;
    description: string;
    url?: string;
  };
  origin: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

interface ImageApiType {
  id: string;
  metaUrl: string;
  title: {
    title: string;
    language: string;
  };
  alttext: {
    alttext: string;
    language: string;
  };
  imageUrl: string;
  size: number;
  copyright: ImageApiCopyright;
  tags: {
    tags: string[];
    language: string;
  };
  caption: {
    caption: string;
    language: string;
  };
  supportedLanguages: string[];
  created: string;
  createdBy: string;
  modelRelease: string;
  editorNotes?: {
    timestamp: string;
    updatedBy: string;
    note: string;
  }[];
}

export const fetchImageResources = async (
  embed: EmbedType,
  accessToken: string,
  language: LocaleType,
): Promise<EmbedType & { image: ImageApiType }> => {
  const url = typeof embed.data.url === 'string' ? embed.data.url : '';
  const response = await fetch(`${convertToInternalUrlIfPossible(url)}?language=${language}`, {
    headers: headerWithAccessToken(accessToken),
  });
  const image = await resolveJsonOrRejectWithError<ImageApiType>(response);
  return { ...embed, image };
};
