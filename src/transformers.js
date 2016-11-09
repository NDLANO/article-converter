/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchImageResources } from './api/imageApi';
import { fetchAudio } from './api/audioApi';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { extractCopyrightInfoFromEmbeds } from './extractCopyrightInfo';

export async function transformContentAndExtractCopyrightInfo(content, lang, requiredLibraries) {
  const embeds = await getEmbedsFromHtml(content);

  const embedsWithResources = await Promise.all(embeds.map((embed) => {
    if (embed.resource === 'image') {
      return fetchImageResources(embed);
    } else if (embed.resource === 'audio') {
      return fetchAudio(embed);
    }
    return embed;
  }));

  return {
    html: await replaceEmbedsInHtml(embedsWithResources, content, lang, requiredLibraries),
    copyrights: extractCopyrightInfoFromEmbeds(embedsWithResources),
  };
}
