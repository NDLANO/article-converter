/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheerioAPI } from 'cheerio';
import createPlugins from './plugins';
import { EmbedType, TransformOptions } from './interfaces';

export async function getEmbedsFromHtml(
  html: CheerioAPI,
  options?: TransformOptions,
): Promise<EmbedType[]> {
  const plugins = createPlugins(options ?? {});
  const embeds = html('embed')
    .map((_, embed) => ({
      embed: html(embed),
      data: html(embed).data(),
      plugin: plugins.find((p) => p && p.resource === embed.attribs['data-resource']),
    }))
    .get();

  return embeds;
}
