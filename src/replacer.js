/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';
import t from './locale/i18n';

export function replaceEmbedsInHtml(embeds, lang) {
  embeds.forEach(embed => {
    const plugin = embed.plugin;

    if (embed.status === 'error') {
      const html = plugin.onError
        ? plugin.onError(embed, lang)
        : `<strong style="color: #FE5F55">${t.error}</strong>`;
      embed.embed.replaceWith(html);
    } else if (plugin) {
      const html = plugin.embedToHTML(embed, lang);
      embed.embed.replaceWith(html);
    } else {
      log.warn(
        `Do not create markup for unknown embed '${embed.data.resource}'`
      );
    }
  });
}
