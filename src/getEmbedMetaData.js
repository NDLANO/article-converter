/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';

export default function getEmbedMetaData(embeds) {
  return embeds.reduce((ctx, embed) => {
    const key = `${embed.data.resource}s`;
    const resourceMetaData = defined(ctx[key], []);
    const embedPlugin = embed.plugin;

    if (
      embedPlugin &&
      embed.status !== 'error' &&
      embedPlugin.getMetaData?.(embed)
    ) {
      const metaData = embedPlugin.getMetaData(embed);
      return {
        ...ctx,
        [key]: [...resourceMetaData, metaData],
      };
    } else {
      return ctx;
    }
  }, {});
}
