/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { EmbedType, LocaleType, PluginUnion } from './interfaces';
import { findPlugin } from './utils/findPlugin';

export default function getEmbedMetaData(
  embeds: EmbedType[],
  locale: LocaleType,
  plugins: PluginUnion[],
) {
  return embeds.reduce((ctx: Record<string, unknown[]>, embed) => {
    const plugin = findPlugin(plugins, embed);
    const key = `${embed.data.resource}s`;
    const resourceMetaData = defined(ctx[key], []);
    const metaData = plugin?.getMetaData?.(embed, locale);
    if (embed.status !== 'error' && metaData) {
      return {
        ...ctx,
        [key]: [...resourceMetaData, metaData],
      };
    } else {
      return ctx;
    }
  }, {});
}
