/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';

export function replaceEmbedsInHtml(embeds, lang) {
  embeds.forEach(embed => {
    const plugin = embed.plugin;
    if (plugin) {
      const html = plugin.embedToHTML(embed, lang);
      embed.embed.replaceWith(html);
    } else {
      log.warn(
        `Do not create markup for unknown embed '${embed.data.resource}'`
      );
    }
  });
}

export function addClassToTag(tag, className) {
  return html => {
    const reTag = new RegExp(`<${tag}>`, 'g');
    return html.replace(reTag, `<${tag} class="${className}">`);
  };
}

export function replaceStartAndEndTag(tag, newStartTag, newEndTag) {
  return html => {
    const reStart = new RegExp(`<${tag}>`, 'g');
    const reEnd = new RegExp(`</${tag}>`, 'g');
    return html.replace(reStart, newStartTag).replace(reEnd, newEndTag);
  };
}
