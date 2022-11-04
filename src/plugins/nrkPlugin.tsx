/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Plugin, Embed } from '../interfaces';

export interface NRKEmbed extends Embed<NRKEmbedData> {}

export interface NRKPlugin extends Plugin<NRKEmbed, NRKEmbedData> {
  resource: 'nrk';
}

export interface NRKEmbedData {
  resource: 'nrk';
  nrkVideoId: string;
  url: string;
}

export default function createNRKPlugin(): NRKPlugin {
  const embedToHTML = async (embed: NRKEmbed) => ({
    html: `<div class="nrk-video" data-nrk-id="${embed.data.nrkVideoId}"></div>`,
  });

  return {
    resource: 'nrk',
    embedToHTML,
  };
}
