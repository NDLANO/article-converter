/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { extractCopyrightInfoFromEmbeds } from './extractCopyrightInfo';

export const tagReplacers = [
  content => {
    content('aside').each((_, aside) => {
      const innerAside = `<div class="c-aside__content">${content(
        aside
      ).children()}</div>`;
      content(aside).addClass('c-aside c-aside--float expanded');
      content(aside).html(innerAside);
    });
  },
];

export async function transformContentAndExtractCopyrightInfo(
  content,
  lang,
  accessToken
) {
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await Promise.all(
    embeds.map(embed => {
      const plugin = embed.plugin;
      if (plugin && plugin.fetchResource) {
        return plugin.fetchResource(embed, accessToken);
      }
      return embed;
    })
  );

  replaceEmbedsInHtml(embedsWithResources, lang);
  tagReplacers.forEach(replacer => replacer(content));

  return {
    html: content.html(),
    copyrights: extractCopyrightInfoFromEmbeds(embedsWithResources),
  };
}
