/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { audioFilesI18N } from './utils/i18nFieldFinder';

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
      return createCopyrightObject(embed, embed.image.images.full.url);
    case 'audio':
      return createCopyrightObject(embed, audioFilesI18N(embed.audio, lang, true).url);
    default:
      return undefined;
  }
}

export function extractCopyrightInfoFromEmbeds(embeds, lang) {
  return embeds
    .map(embed => toCopyrightObject(embed, lang))
    .filter(embed => embed !== undefined)
    ;
}
