/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import log from './utils/logger';
import t from './locale/i18n';

// Fetched from https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
// because normal forEach does not care about async/await
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export async function replaceEmbedsInHtml(embeds, lang, options) {
  return asyncForEach(embeds, async embed => {
    const plugin = embed.plugin;
    if (embed.status === 'error') {
      const html = plugin.onError
        ? plugin.onError(embed, lang)
        : `<strong style="color: #FE5F55">${t.error}</strong>`;
      embed.embed.replaceWith(html);
    } else if (plugin) {
      const html = await plugin.embedToHTML(embed, lang, options);
      embed.embed.replaceWith(html);
    } else if (embed.embed.attr('data-resource') === 'file') {
      // do nothing
    } else {
      log.warn(
        `Do not create markup for unknown embed '${embed.data.resource}'`
      );
    }
  });
}
