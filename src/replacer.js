/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';
import plugins from './plugins';

const stringReplaceAsync = require('string-replace-async');

function createEmbedMarkup(embed, lang) {
  const plugin = plugins.find(p => p.resource === embed.resource);

  if (plugin) {
    return plugin.embedToHTML(embed, lang);
  }

  log.warn(embed, 'Do not create markup for unknown embed');
  return undefined;
}

export function replaceEmbedsInHtml(embeds, lang) {
  return async (html) => {
    const reEmbeds = new RegExp(/<embed.*?\/>/g);
    const reDataId = new RegExp(/data-id="(.*?)"/);
    const markup = await stringReplaceAsync(html, reEmbeds, (embedHtml) => {
      const id = embedHtml.match(reDataId)[1];
      const embed = embeds.find(f => f.id.toString() === id);
      return Promise.resolve(createEmbedMarkup(embed, lang, plugins) || '');
    });
    return markup;
  };
}

export function addClassToTag(tag, className) {
  return (html) => {
    const reTag = new RegExp(`<${tag}>`, 'g');
    return html.replace(reTag, `<${tag} class="${className}">`);
  };
}

export function replaceStartAndEndTag(tag, newStartTag, newEndTag) {
  return (html) => {
    const reStart = new RegExp(`<${tag}>`, 'g');
    const reEnd = new RegExp(`</${tag}>`, 'g');
    return html
            .replace(reStart, newStartTag)
            .replace(reEnd, newEndTag);
  };
}
