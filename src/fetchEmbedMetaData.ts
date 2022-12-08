/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEmbedsFromHtml } from './parser';
import { getEmbedsResources } from './transformers';
import getEmbedMetaData from './getEmbedMetaData';
import { ApiOptions } from './interfaces';
import createPlugins from './plugins';
import { parseHtml } from './utils/htmlParser';

export default async function fetchEmbedMetaData(embedTag: string, apiOptions: ApiOptions) {
  const c = parseHtml(embedTag);
  const plugins = createPlugins({});
  const embeds = await getEmbedsFromHtml(c);
  const embedsWithResources = await getEmbedsResources(embeds, apiOptions, plugins);
  return await getEmbedMetaData(embedsWithResources, apiOptions.lang, plugins);
}
