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
import { replaceEmbedsInHtml, addClassToTag, replaceStartAndEndTag } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { extractCopyrightInfoFromEmbeds } from './extractCopyrightInfo';

// Changes aside tags to accommodate frontend styling
export const asideReplacers = [
  replaceStartAndEndTag('aside', '<aside><div className="c-aside__content">', '</div><button className="c-aside__button"></button></aside>'),
  addClassToTag('aside', 'c-aside u-1/3@desktop'),
];

export async function transformContentAndExtractCopyrightInfo(content, lang, requiredLibraries) {
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await Promise.all(embeds.map((embed) => {
    if (embed.resource === 'image') {
      return fetchImageResources(embed);
    } else if (embed.resource === 'audio') {
      return fetchAudio(embed);
    } else if ((embed.resource === 'h5p' && embed.url.startsWith('https://ndlah5p.joubel.com')) || embed.resource === 'external') {
      return fetchOembed(embed);
    }
    return embed;
  }));

  const replacers = [
    ...asideReplacers,
    replaceEmbedsInHtml(embedsWithResources, lang, requiredLibraries),
  ];


  return {
    html: replacers.reduce((html, f) => f(html), content),
    copyrights: extractCopyrightInfoFromEmbeds(embedsWithResources),
  };
}
