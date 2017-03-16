/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ndlaFrontendUrl } from '../config';

export default function createContentLinkPlugin() {
  const createEmbedObject = obj => (
      { id: parseInt(obj.id, 10), resource: obj.resource, contentId: obj['content-id'], linkText: obj['link-text'] }
  );

  const embedToHTML = (embed, lang) => `<a href="${ndlaFrontendUrl}/${lang}/article/${embed.contentId}">${embed.linkText}</a>`;

  return {
    resource: 'content-link',
    createEmbedObject,
    embedToHTML,
  };
}
