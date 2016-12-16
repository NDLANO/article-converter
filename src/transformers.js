/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchImageResources } from './api/imageApi';
import { fetchAudio } from './api/audioApi';
import { fetchOembed } from './api/oembedProxyApi';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { extractCopyrightInfoFromEmbeds } from './extractCopyrightInfo';

export async function transformContentAndExtractCopyrightInfo(content, lang, requiredLibraries) {
  const embeds = await getEmbedsFromHtml(content);
  let embedsWithResources = await Promise.all(embeds.map((embed) => {
    if (embed.resource === 'image') {
      return fetchImageResources(embed);
    } else if (embed.resource === 'audio') {
      return fetchAudio(embed);
    } else if ((embed.resource === 'h5p' && embed.url.startsWith('https://ndlah5p.joubel.com')) || embed.resource === 'youtube') {
      return fetchOembed(embed);
    }
    return embed;
  }));

  embedsWithResources = embedsWithResources.filter(e => e !== undefined);
  return {
    html: await replaceEmbedsInHtml(embedsWithResources, content, lang, requiredLibraries),
    copyrights: extractCopyrightInfoFromEmbeds(embedsWithResources),
  };
}
