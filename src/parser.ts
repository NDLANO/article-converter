/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio, { CheerioAPI, Element } from 'cheerio';
import { EmbedType, PluginUnion, TransformOptions, Plugin } from './interfaces';

export const findPlugin = <T extends EmbedType>(
  plugins: PluginUnion[],
  embed: T,
): Plugin<T> | undefined => {
  const plugin = plugins.find((p) => {
    return p.resource === embed.embed.data().resource;
  });

  return plugin as Plugin<T>;
};

export async function getEmbedsFromHtml(html: CheerioAPI): Promise<EmbedType[]> {
  return html('embed')
    .toArray()
    .map((embed) => ({
      embed: html(embed),
      data: html(embed).data(),
    }));
}
