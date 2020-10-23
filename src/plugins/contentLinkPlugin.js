/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchArticleResource } from '../api/taxonomyApi';
import log from '../utils/logger';

export default function createContentLinkPlugin(options = {}) {
  async function fetchResource(embed, accessToken, language) {
    const contentType = embed?.data?.contentType;
    let path = `${language}/${
      contentType === 'learningpath' ? 'learningpaths' : 'article'
    }/${embed.data.contentId}`;

    try {
      const resource = await fetchArticleResource(
        embed.data.contentId,
        accessToken,
        language,
        contentType
      );
      const resourcePath =
        (resource.paths &&
          resource.paths.find(
            p =>
              options.subject &&
              p.split('/')[1] === options.subject.replace('urn:', '')
          )) ||
        resource.path;

      if (resourcePath) {
        path = `${language}/subjects${resourcePath}`;
        if (options.filters) {
          path = path + `?filters=${options.filters}`;
        }
      }
      return { ...embed, path };
    } catch (error) {
      log.error(error);
      return {
        ...embed,
        path,
      };
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
