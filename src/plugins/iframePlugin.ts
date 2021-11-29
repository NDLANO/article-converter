/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { makeIframe } from './pluginHelpers';
import { Plugin, EmbedType } from '../interfaces';

export default function createIframePlugin(): Plugin<EmbedType> {
  const embedToHTML = async (embed: EmbedType) => {
    const { url, width, height } = embed.data as Record<string, string>;
    const resize = !url.includes('trinket.io');
    return { html: makeIframe(url, width, height, '', resize) };
  };

  return {
    resource: 'iframe',
    embedToHTML,
  };
}
