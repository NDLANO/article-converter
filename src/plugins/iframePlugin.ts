/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { makeIframe } from './pluginHelpers';
import { Plugin, Embed } from '../interfaces';

export interface IframeEmbed extends Embed<IframeEmbedData> {}

export interface IframePlugin extends Plugin<IframeEmbed, IframeEmbedData> {
  resource: 'iframe';
}

export interface IframeEmbedData {
  resource: 'iframe';
  type: string;
  url: string;
  width?: string;
  height?: string;
  title?: string;
  caption?: string;
  imageId?: string;
}

export default function createIframePlugin(): IframePlugin {
  const embedToHTML = async (embed: IframeEmbed) => {
    const { url, width, height } = embed.data;
    const resize = !url.includes('trinket.io');
    return { html: makeIframe(url, width ?? '', height ?? '', '', resize) };
  };

  return {
    resource: 'iframe',
    embedToHTML,
  };
}
