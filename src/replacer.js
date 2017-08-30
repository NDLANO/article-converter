/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';

function createEmbedMarkup(embed, lang) {
  const plugin = embed.plugin;

  if (plugin) {
    plugin.embedToHTML(embed, lang);
  } else {
    log.warn(embed, 'Do not create markup for unknown embed');
  }
}

export function replaceEmbedsInHtml(embeds, lang) {
  embeds.forEach(embed => createEmbedMarkup(embed, lang));
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
