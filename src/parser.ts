/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheerioAPI } from 'cheerio';
import createPlugins from './plugins';
import { EmbedType } from './interfaces';

export function getEmbedsFromHtml(html: CheerioAPI, options?: any): Promise<EmbedType[]> {
  const plugins = createPlugins(options);
  return new Promise(resolve => {
    const embeds: EmbedType[] = html('embed')
      .map((_, embed) => ({
        embed: html(embed),
        data: html(embed).data(),
        plugin: plugins.find(p => p && p.resource === embed.attribs['data-resource']),
      }))
      .get();

    resolve(embeds);
  });
}
