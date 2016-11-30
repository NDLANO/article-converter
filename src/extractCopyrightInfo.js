/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { groupBy, map, filter, compose } from 'lodash/fp';
import { audioFilesI18N, titlesI18N } from './utils/i18nFieldFinder';

function createCopyrightObject(embed, src) {
  return {
    type: embed.resource,
    copyright: embed[`${embed.resource}`].copyright,
    src,
  };
}

function toCopyrightObject(embed, lang) {
  switch (embed.resource) {
    case 'image':
      return createCopyrightObject(embed, embed.image.imageUrl);
    case 'audio':
      return {
        title: titlesI18N(embed.audio, lang, true),
        ...createCopyrightObject(embed, audioFilesI18N(embed.audio, lang, true).url),
      };
    default:
      return undefined;
  }
}

export function extractCopyrightInfoFromEmbeds(embeds, lang) {
  return compose(
    groupBy('type'),
    filter(embed => embed !== undefined),
    map(embed => toCopyrightObject(embed, lang)),
  )(embeds);
}
