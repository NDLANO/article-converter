/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchArticleResource } from '../api/taxonomyApi';
import log from '../utils/logger';
import config from '../config';
import { Plugin, EmbedType, LocaleType, TransformOptions, SimpleEmbedType } from '../interfaces';

export interface ContentLinkEmbedType extends EmbedType<ContentLinkEmbedData> {
  path: string;
}

export interface ContentLinkEmbedData {
  resource: string;
  contentId: string;
  linkText: string;
  openIn?: string;
  contentType?: string;
}

export interface ContentLinkPlugin extends Plugin<ContentLinkEmbedType, ContentLinkEmbedData> {
  resource: 'content-link';
}

export default function createContentLinkPlugin(options: TransformOptions = {}): ContentLinkPlugin {
  async function fetchResource(
    embed: SimpleEmbedType<ContentLinkEmbedData>,
    accessToken: string,
    language: LocaleType,
  ): Promise<ContentLinkEmbedType> {
    const contentType = embed?.data?.contentType;
    const host = options.absoluteUrl ? config.ndlaFrontendDomain : '';
    let path = `${host}/${language}/${
      contentType === 'learningpath' ? 'learningpaths' : 'article'
    }/${embed.data.contentId}`;

    try {
      const resource = await fetchArticleResource(
        embed.data.contentId,
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
        path = `${host}/${language}${resourcePath}`;
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
      return {
        html: `<a href="${embed.path}" target="_blank" rel="noopener noreferrer">${embed.data.linkText}</a>`,
      };
    }
    return {
      html: `<a href="${embed.path}" ${options.isOembed ? 'target="_blank"' : ''}>${
        embed.data.linkText
      }</a>`,
    };
  };

  return {
    resource: 'content-link',
    fetchResource,
    embedToHTML,
  };
}
