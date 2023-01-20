/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { performance } from 'perf_hooks';
import { CheerioAPI } from 'cheerio';
import compact from 'lodash/compact';
import Logger from 'bunyan';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';
import createPlugins from './plugins';
import getLogger from './utils/logger';
import { htmlTransforms } from './htmlTransformers';
import {
  ApiOptions,
  AnyPlugin,
  LocaleType,
  TransformOptions,
  ResponseHeaders,
  AnyEmbed,
  PlainEmbed,
} from './interfaces';
import { findPlugin } from './utils/findPlugin';
import { mergeResponseHeaders } from './utils/mergeResponseHeaders';

function logIfLongTime(log: Logger, start: number, timeout: number, action: string, obj: any) {
  const elapsedTime = performance.now() - start;
  if (elapsedTime > timeout) {
    log.warn(
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
  embeds: PlainEmbed[],
  apiOptions: ApiOptions,
  plugins: AnyPlugin[],
): Promise<AnyEmbed[]> {
  const log = getLogger();
  return Promise.all(
    embeds.map(async (embed) => {
      const plugin = findPlugin(plugins, embed);
      if (plugin && plugin.fetchResource) {
        const startStamp = performance.now();
        try {
          const resource = await plugin.fetchResource(embed, apiOptions);

          logIfLongTime(log, startStamp, 500, `Fetching resource`, embed.data);
          return resource;
        } catch (e) {
          log.warn('Failed to fetch embed resource data for ', embed.data);
          log.warn(e);
          logIfLongTime(log, startStamp, 500, `Failed fetching resource`, embed.data);
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
  headers: Record<string, string>,
  apiOptions: ApiOptions,
  visualElement: { visualElement: string } | undefined,
  options: TransformOptions,
) => Promise<{ html: string | null; embedMetaData: any; responseHeaders?: ResponseHeaders }>;

export const transform: TransformFunction = async (
  content,
  headers,
  apiOptions,
  visualElement,
  options,
) => {
  if (visualElement?.visualElement && options?.showVisualElement) {
    content('body').prepend(`<section>${visualElement.visualElement}</section>`);
  }

  const transformOptions = { transform, ...options, lang: apiOptions.lang };
  const plugins = createPlugins(transformOptions);
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await getEmbedsResources(embeds, apiOptions, plugins);

  const htmlHeaders = await replaceEmbedsInHtml(embedsWithResources, apiOptions.lang, plugins);

  const embedMetaData = await getEmbedMetaData(embedsWithResources, apiOptions.lang, plugins);

  const fetchedResourceHeaders = compact(
    embedsWithResources.map((x) => 'responseHeaders' in x && x.responseHeaders),
  );

  const allResponseHeaders = [...fetchedResourceHeaders, ...htmlHeaders, headers];
  const responseHeaders = mergeResponseHeaders(allResponseHeaders);
  await executeHtmlTransforms(content, apiOptions.lang, options);

  return {
    html: content('body').html(),
    embedMetaData,
    responseHeaders,
  };
};
