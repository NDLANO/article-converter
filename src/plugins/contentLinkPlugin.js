/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ndlaFrontendUrl } from '../config';

export default function createContentLinkPlugin() {
  const embedToHTML = (embed, lang) =>
    `<a href="${ndlaFrontendUrl}/${lang}/article/${embed.data
      .contentId}">${embed.data.linkText}</a>`;

  return {
    resource: 'content-link',
    embedToHTML,
  };
}
