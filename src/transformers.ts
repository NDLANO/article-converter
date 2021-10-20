/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { performance } from 'perf_hooks';
import { CheerioAPI } from 'cheerio';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';
import createPlugins from './plugins';
import log from './utils/logger';
import { htmlTransforms } from './htmlTransformers';
import { PluginUnion, EmbedType, LocaleType, TransformOptions } from './interfaces';
import { findPlugin } from './utils/findPlugin';

function logIfLongTime(start: number, timeout: number, action: string, obj: any) {
  const elapsedTime = performance.now() - start;
  if (elapsedTime > timeout) {
    console.warn(
      `Action '${action}' took ${elapsedTime.toFixed(
        2,
      )}ms, longer than time to warn of ${timeout}ms...`,
      obj,
    );
  }
}

async function executeHtmlTransforms(
  content: CheerioAPI,
  lang: LocaleType,
  options: TransformOptions,
): Promise<void> {
  // We use this reduce trick so the transformations happen in sequence even if the function is asynchronous
  const starterPromise = Promise.resolve();
  await htmlTransforms.reduce(
    (
      maybePromise: Promise<void>,
      replacer: (content: CheerioAPI, lang: LocaleType, options: TransformOptions) => void,
    ) => maybePromise.then(() => replacer(content, lang, options)),
    starterPromise,
  );
}

export async function getEmbedsResources(
  embeds: EmbedType[],
  accessToken: string,
  lang: LocaleType,
  plugins: PluginUnion[],
) {
  return Promise.all(
    embeds.map(async (embed) => {
      const plugin = findPlugin(plugins, embed);
      if (plugin && plugin.fetchResource) {
        const startStamp = performance.now();
        try {
          const resource = await plugin.fetchResource(embed, accessToken, lang);
          logIfLongTime(startStamp, 500, `Fetching resource`, embed.data);
          return resource;
        } catch (e) {
          log.warn('Failed to fetch embed resource data for ', embed.data);
          log.warn(e);
          logIfLongTime(startStamp, 500, `Failed fetching resource`, embed.data);
          return {
            ...embed,
            status: 'error',
          };
        }
      }
      return embed;
    }),
  );
}

export type TransformFunction = (
  content: CheerioAPI,
  lang: LocaleType,
  accessToken: string,
  visualElement: { visualElement: string } | undefined,
  options: TransformOptions,
) => Promise<{ html: string | null; embedMetaData: any }>;

export const transform: TransformFunction = async (
  content,
  lang,
  accessToken,
  visualElement,
  options,
) => {
  if (visualElement?.visualElement && options?.showVisualElement) {
    content('body').prepend(`<section>${visualElement.visualElement}</section>`);
  }

  const transformOptions = { transform, ...options };
  const plugins = createPlugins(transformOptions);
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await getEmbedsResources(embeds, accessToken, lang, plugins);

  await replaceEmbedsInHtml(embedsWithResources, lang, plugins);
  const embedMetaData = await getEmbedMetaData(embedsWithResources, lang, plugins);
  await executeHtmlTransforms(content, lang, options);

  return {
    html: content('body').html(),
    embedMetaData,
  };
};