/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheerioAPI } from 'cheerio';
import { EmbedData, SimpleEmbedType } from './interfaces';

export async function getEmbedsFromHtml(html: CheerioAPI): Promise<SimpleEmbedType<EmbedData>[]> {
  return html('embed')
    .toArray()
    .map(
      (embed) =>
        ({
          embed: html(embed),
          data: html(embed).data(),
        } as SimpleEmbedType<EmbedData>),
    );
}
