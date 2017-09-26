/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';

function createEmbedMarkup(embed, lang, context) {
  const plugin = embed.plugin;

  if (plugin) {
    return plugin.embedToHTML(embed, lang, context);
  }
  return log.warn(embed, 'Do not create markup for unknown embed');
}

export function replaceEmbedsInHtml(embeds, lang) {
  return embeds.reduce((ctx, embed) => {
    const res = createEmbedMarkup(
      embed,
      lang,
      ctx[embed.plugin.resource] || {}
    );
    return {
      ...ctx,
      [embed.plugin.resource]: res,
    };
  }, {});
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
