/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { performance } from 'perf_hooks';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';
import log from './utils/logger';
import { htmlTransforms } from './htmlTransformers';

function logIfLongTime(start, timeout, action, obj) {
  const elapsedTime = (performance.now() - start).toFixed(2);
  if (elapsedTime > timeout) {
    console.warn(
      `Action '${action}' took ${elapsedTime}ms, longer than time to warn of ${timeout}ms...`,
      obj
    );
  }
}

async function executeHtmlTransforms(content, lang, options) {
  // We use this reduce trick so the transformations happen in sequence even if the function is asynchronous
  const starterPromise = Promise.resolve(null);
  await htmlTransforms.reduce(
    (maybePromise, replacer) =>
      maybePromise.then(() => replacer(content, lang, options)),
    starterPromise
  );
}

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
        const startStamp = performance.now();
        try {
          const resource = await plugin.fetchResource(embed, accessToken, lang);
          logIfLongTime(startStamp, 500, `Fetching resource`, embed.data);
          return resource;
        } catch (e) {
          log.warn('Failed to fetch embed resource data for ', embed.data);
          log.warn(e);
          logIfLongTime(
            startStamp,
            500,
            `Failed fetching resource`,
            embed.data
          );
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
  await executeHtmlTransforms(content, lang, options);

  return {
    html: content('body').html(),
    embedMetaData,
  };
}
