/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';
import plugins from './plugins';

function createEmbedMarkup(embed, lang) {
  const plugin = plugins.find(p => p.resource === embed.resource);

  if (plugin) {
    return plugin.embedToHTML(embed, lang);
  }

  log.warn(embed, 'Do not create markup for unknown embed');
  return undefined;
}

export function replaceEmbedsInHtml(embeds, lang, requiredLibraries) {
  return (html) => {
    const reEmbeds = new RegExp(/<embed.*?\/>/g);
    const reDataId = new RegExp(/data-id="(.*?)"/);
    const markup = html.replace(reEmbeds, (embedHtml) => {
      const id = embedHtml.match(reDataId)[1];
      const embed = embeds.find(f => f.id.toString() === id);
      return createEmbedMarkup(embed, lang, plugins) || '';
    });

    const scripts = requiredLibraries.map(library =>
          `<script type="${library.mediaType}" src="${library.url}"></script>`
        ).join();

    return markup + scripts;
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
    const reEnd = new RegExp(`<\/${tag}>`, 'g');
    return html
            .replace(reStart, newStartTag)
            .replace(reEnd, newEndTag);
  };
}
