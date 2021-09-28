/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { getEmbedsFromHtml } from './parser';
// @ts-ignore
import { getEmbedsResources } from './transformers';
import getEmbedMetaData from './getEmbedMetaData';
import { LocaleType } from './interfaces';

export default async function fetchEmbedMetaData(
  embedTag: string,
  accessToken: string,
  language: LocaleType,
) {
  const c = cheerio.load(embedTag);
  const embeds = await getEmbedsFromHtml(c);
  const embedsWithResources = await getEmbedsResources(embeds, accessToken, language);
  return getEmbedMetaData(embedsWithResources, language);
}
