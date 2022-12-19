/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchArticleResource } from '../api/taxonomyApi';
import getLogger from '../utils/logger';
import config from '../config';
import { Plugin, Embed, ApiOptions, TransformOptions, PlainEmbed } from '../interfaces';

export interface ContentLinkEmbed extends Embed<ContentLinkEmbedData> {
  path: string;
}

export interface ContentLinkEmbedData {
  resource: 'content-link';
  contentId: string;
  linkText?: string;
  openIn?: string;
  contentType?: string;
}

export interface ContentLinkPlugin extends Plugin<ContentLinkEmbed, ContentLinkEmbedData> {
  resource: 'content-link';
}

function getLinkText(embed: PlainEmbed<ContentLinkEmbedData>): string {
  const child = embed.embed.html();
  if (child) return child;
  const attrText = embed.data.linkText;
  if (attrText) return attrText;

  return 'link';
}

export default function createContentLinkPlugin(options: TransformOptions = {}): ContentLinkPlugin {
  async function fetchResource(
    embed: PlainEmbed<ContentLinkEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<ContentLinkEmbed> {
    const contentType = embed?.data?.contentType;
    const host = options.absoluteUrl ? config.ndlaFrontendDomain : '';
    let path = `${host}/${apiOptions.lang}/${
      contentType === 'learningpath' ? 'learningpaths' : 'article'
    }/${embed.data.contentId}`;

    try {
      const resource = await fetchArticleResource(embed.data.contentId, apiOptions);
      const resourcePath =
        (resource?.paths &&
          resource.paths.find(
            (p) => options.subject && p.split('/')[1] === options.subject.replace('urn:', ''),
          )) ||
        resource?.path;

      if (resourcePath) {
        path = `${host}/${apiOptions.lang}${resourcePath}`;
      }
      return { ...embed, path };
    } catch (error) {
      getLogger().error(error);
      return {
        ...embed,
        path,
      };
    }
  }

  const embedToHTML = async (embed: ContentLinkEmbed) => {
    const linkText = getLinkText(embed);
    if (embed.data.openIn === 'new-context') {
      return {
        html: `<a href="${embed.path}" target="_blank" rel="noopener noreferrer">${linkText}</a>`,
      };
    }
    return {
      html: `<a href="${embed.path}" ${options.isOembed ? 'target="_blank"' : ''}>${linkText}</a>`,
    };
  };

  return {
    resource: 'content-link',
    fetchResource,
    embedToHTML,
  };
}
