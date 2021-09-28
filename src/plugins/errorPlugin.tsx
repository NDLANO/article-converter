/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EmbedType } from '../interfaces';
import { Plugin } from './index';

export default function createErrorPlugin(): Plugin {
  const embedToHTML = async (embed: EmbedType) =>
    `<div><strong>${embed.data.message}</strong></div>`;

  return {
    resource: 'error',
    embedToHTML,
  };
}
