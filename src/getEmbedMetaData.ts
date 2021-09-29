/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { EmbedTypeWithPlugin, LocaleType } from './interfaces';
import { PluginUnion } from './plugins';

export default function getEmbedMetaData(
  embeds: EmbedTypeWithPlugin<PluginUnion>[],
  locale: LocaleType,
) {
  return embeds.reduce((ctx: Record<string, unknown[]>, embed) => {
    const key = `${embed.data.resource}s`;
    const resourceMetaData = defined(ctx[key], []);
    const metaData = embed.plugin?.getMetaData?.(embed, locale);
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
