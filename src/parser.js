/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import plugins from './plugins';

export function getEmbedsFromHtml(html) {
  return new Promise(resolve => {
    const embeds = html('embed')
      .map((_, embed) => ({
        embed: html(embed),
        data: html(embed).data(),
        plugin: plugins.find(
          p => p.resource === embed.attribs['data-resource']
        ),
      }))
      .get();
    resolve(embeds);
  });
}
