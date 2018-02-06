/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ndlaFrontendUrl } from '../config';
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

      const urnPath = resource.path
        .split('/')
        .map(s => (s !== '' ? `urn:${s}` : s))
        .join('/');
      const fullPath = `article${urnPath}/${embed.data.contentId}`;

      return { ...embed, path: fullPath };
    } catch (error) {
      log.error(error);
      return { ...embed, path: `article/${embed.data.contentId}` };
    }
  }

  const embedToHTML = (embed, lang) => {
    if (embed.data.openIn === 'new-context') {
      return `<a href="${ndlaFrontendUrl}/${lang}/${
        embed.path
      }" target="_blank" rel="noopener noreferrer">${embed.data.linkText}</a>`;
    }
    return `<a href="${ndlaFrontendUrl}/${lang}/${embed.path}">${
      embed.data.linkText
    }</a>`;
  };

  return {
    resource: 'content-link',
    fetchResource,
    embedToHTML,
  };
}
