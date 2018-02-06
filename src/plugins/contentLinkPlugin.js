/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchArticleResource } from '../api/taxonomyApi';
import log from '../utils/logger';

export default function createContentLinkPlugin() {
  async function fetchResource(embed, accessToken, lang) {
    try {
      const resource = await fetchArticleResource(
        embed.data.contentId,
        accessToken,
        lang
      );

      return { ...embed, path: `subjects${resource.path}` };
    } catch (error) {
      log.error(error);
      return { ...embed, path: `article/${embed.data.contentId}` };
    }
  }

  const embedToHTML = embed => {
    if (embed.data.openIn === 'new-context') {
      return `<a href="/${
        embed.path
      }" target="_blank" rel="noopener noreferrer">${embed.data.linkText}</a>`;
    }
    return `<a href="/${embed.path}">${embed.data.linkText}</a>`;
  };

  return {
    resource: 'content-link',
    fetchResource,
    embedToHTML,
  };
}
