/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchArticleResource } from '../api/taxonomyApi';
import log from '../utils/logger';
import { Plugin } from './index';
import { EmbedType, LocaleType, TransformOptions } from '../interfaces';

interface ContentLinkEmbedType extends EmbedType {
  path: string;
}

interface ContentLinkPlugin extends Plugin<ContentLinkEmbedType> {
  resource: 'content-link';
}

export default function createContentLinkPlugin(options: TransformOptions = {}): ContentLinkPlugin {
  async function fetchResource(
    embed: EmbedType,
    accessToken: string,
    language: LocaleType,
  ): Promise<ContentLinkEmbedType> {
    const contentType = embed?.data?.contentType as string | undefined;
    let path = `${language}/${contentType === 'learningpath' ? 'learningpaths' : 'article'}/${
      embed.data.contentId
    }`;

    try {
      const resource = await fetchArticleResource(
        embed.data.contentId as string,
        accessToken,
        language,
        contentType,
      );
      const resourcePath =
        (resource?.paths &&
          resource.paths.find(
            (p) => options.subject && p.split('/')[1] === options.subject.replace('urn:', ''),
          )) ||
        resource?.path;

      if (resourcePath) {
        path = `${language}${resourcePath}`;
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

  const embedToHTML = async (embed: ContentLinkEmbedType) => {
    if (embed.data.openIn === 'new-context') {
      return `<a href="/${embed.path}" target="_blank" rel="noopener noreferrer">${embed.data.linkText}</a>`;
    }
    return `<a href="/${embed.path}" ${options.isOembed ? 'target="_blank"' : ''}>${
      embed.data.linkText
    }</a>`;
  };

  return {
    resource: 'content-link',
    fetchResource,
    embedToHTML,
  };
}
