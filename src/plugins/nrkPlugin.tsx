/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Plugin } from './index';
import { EmbedType } from '../interfaces';

export default function createNRKPlugin(): Plugin {
  const embedToHTML = (embed: EmbedType) =>
    `<div class="nrk-video" data-nrk-id="${embed.data.nrkVideoId}"></div>`;

  return {
    resource: 'nrk',
    embedToHTML,
  };
}
