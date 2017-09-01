/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { groupBy, map, filter, compose } from 'lodash/fp';

function createCopyrightObject(embed, src) {
  return {
    type: embed.data.resource,
    copyright: embed[`${embed.data.resource}`].copyright,
    src,
  };
}

function toCopyrightObject(embed) {
  switch (embed.data.resource) {
    case 'image':
      return createCopyrightObject(embed, embed.image.imageUrl);
    case 'audio':
      return {
        title: embed.audio.title,
        ...createCopyrightObject(embed, embed.audio.audioFile.url),
      };
    case 'brightcove':
      return createCopyrightObject(embed);
    default:
      return undefined;
  }
}

export function extractCopyrightInfoFromEmbeds(embeds) {
  return compose(
    groupBy('type'),
    filter(embed => embed !== undefined),
    map(embed => toCopyrightObject(embed))
  )(embeds);
}
