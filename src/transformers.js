/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';
import log from './utils/logger';
import { htmlTransforms } from './htmlTransformers';

export async function transform(
  content,
  lang,
  accessToken,
  visualElement,
  options
) {
  if (visualElement && visualElement.visualElement) {
    content('body').prepend(
      `<section>${visualElement.visualElement}</section>`
    );
  }
  const embeds = await getEmbedsFromHtml(content, options);
  const embedsWithResources = await Promise.all(
    embeds.map(async embed => {
      const plugin = embed.plugin;
      if (plugin && plugin.fetchResource) {
        try {
          const resource = await plugin.fetchResource(embed, accessToken, lang);
          return resource;
        } catch (e) {
          log.warn('Failed to fetch embed resource data for ', embed.data);
          log.warn(e);
          return {
            ...embed,
            status: 'error',
          };
        }
      }
      return embed;
    })
  );
  replaceEmbedsInHtml(embedsWithResources, lang);
  const embedMetaData = getEmbedMetaData(embedsWithResources, lang);
  htmlTransforms.forEach(replacer => replacer(content, lang, options));

  return {
    html: content('body').html(),
    embedMetaData,
  };
}
