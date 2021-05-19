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

export default async function fetchEmbedMetaData(embedTag) {
  const embeds = await getEmbedsFromHtml(cheerio.load(embedTag));
  const embedsWithResources = await getEmbedsResources(embeds);
  return getEmbedMetaData(embedsWithResources);
}
