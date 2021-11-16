/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { getEmbedsFromHtml } from './parser';
import { getEmbedsResources } from './transformers';
import getEmbedMetaData from './getEmbedMetaData';
import { LocaleType } from './interfaces';
import createPlugins from './plugins';

export default async function fetchEmbedMetaData(
  embedTag: string,
  accessToken: string,
  language: LocaleType,
  feideToken: string,
) {
  const c = cheerio.load(embedTag);
  const plugins = createPlugins({});
  const embeds = await getEmbedsFromHtml(c);
  const embedsWithResources = await getEmbedsResources(
    embeds,
    accessToken,
    feideToken,
    language,
    plugins,
  );
  return await getEmbedMetaData(embedsWithResources, language, plugins);
}
