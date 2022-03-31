/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Plugin, Embed } from '../interfaces';

export interface ErrorEmbed extends Embed<ErrorEmbedData> {}

export interface ErrorPlugin extends Plugin<ErrorEmbed, ErrorEmbedData> {
  resource: 'error';
}

export interface ErrorEmbedData {
  resource: 'error';
  message: string;
}

export default function createErrorPlugin(): ErrorPlugin {
  const embedToHTML = async (embed: ErrorEmbed) => ({
    html: `<div><strong>${embed.data.message}</strong></div>`,
  });

  return {
    resource: 'error',
    embedToHTML,
  };
}
