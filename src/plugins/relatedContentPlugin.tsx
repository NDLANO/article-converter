/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import cheerio from 'cheerio';
import { ContentTypeBadge, constants, RelatedArticle } from '@ndla/ui';
import { isObject } from 'lodash/fp';
import { IArticleV2 } from '@ndla/types-article-api';
import getLogger from '../utils/logger';
import { fetchArticle } from '../api/articleApi';
import { ArticleResource, fetchArticleResource } from '../api/taxonomyApi';
import config from '../config';
import t from '../locale/i18n';
import { render } from '../utils/render';
import { ApiOptions, Plugin, Embed, LocaleType, TransformOptions } from '../interfaces';

const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
const RESOURCE_TYPE_TASKS_AND_ACTIVITIES = 'urn:resourcetype:tasksAndActivities';

const mapping = (
  relatedArticleEntryNum: number,
): Record<
  string,
  {
    icon: React.ReactElement;
    modifier: string;
  }
> => {
  const hiddenModifier = relatedArticleEntryNum > 2 ? ' hidden' : '';
  return {
    [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
      icon: (
        <ContentTypeBadge background size="small" type={constants.contentTypes.SUBJECT_MATERIAL} />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
    [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
      icon: (
        <ContentTypeBadge
          background
          size="small"
          type={constants.contentTypes.TASKS_AND_ACTIVITIES}
        />
      ),
      modifier: `tasks-and-activities${hiddenModifier}`,
    },
    'external-learning-resources': {
      icon: (
        <ContentTypeBadge
          background
          size="small"
          type={constants.contentTypes.EXTERNAL_LEARNING_RESOURCES}
        />
      ),
      modifier: `external-learning-resources${hiddenModifier}`,
    },
    subject: {
      icon: <ContentTypeBadge background size="small" type={constants.contentTypes.SUBJECT} />,
      modifier: `subject${hiddenModifier}`,
    },
    default: {
      icon: (
        <ContentTypeBadge background size="small" type={constants.contentTypes.SUBJECT_MATERIAL} />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
  };
};

const getRelatedArticleProps = (
  article: RelatedArticleType,
  relatedArticleEntryNum: number,
  options: TransformOptions,
) => {
  const host = options.absoluteUrl ? config.ndlaFrontendDomain : '';

  if (!article.resource) {
    return {
      ...mapping(relatedArticleEntryNum).default,
      to: `${host}/article/${article.id}`,
    };
  }

  const path =
    (article.resource.paths &&
      article.resource.paths.find(
        (p) => options.subject && p.split('/')[1] === options.subject.replace('urn:', ''),
      )) ||
    article.resource.path;

  const to = path ?? '';

  const resourceType = article.resource.resourceTypes.find(
    (type) => mapping(relatedArticleEntryNum)[type.id],
  );

  if (resourceType) {
    return { ...mapping(relatedArticleEntryNum)[resourceType.id], to: `${host}${to}` };
  }
  return { ...mapping(relatedArticleEntryNum).default, to: `${host}${to}` };
};

type RelatedArticleType = IArticleV2 & { resource?: ArticleResource };

export interface RelatedContentEmbed extends Embed<RelatedContentEmbedData> {
  article?: RelatedArticleType;
}

export interface RelatedContentEmbedData {
  resource: 'related-content';
  articleId?: string;
  url?: string;
  title?: string;
}

export interface RelatedContentPlugin extends Plugin<RelatedContentEmbed, RelatedContentEmbedData> {
  resource: 'related-content';
}

export default function createRelatedContentPlugin(
  options: TransformOptions = {},
): RelatedContentPlugin {
  async function fetchResource(
    embed: RelatedContentEmbed,
    apiOptions: ApiOptions,
  ): Promise<RelatedContentEmbed> {
    const articleId = embed.data.articleId;

    if (articleId && (typeof articleId === 'string' || typeof articleId === 'number')) {
      try {
        const [{ article, responseHeaders }, resource] = await Promise.all([
          fetchArticle(articleId, apiOptions),
          fetchArticleResource(articleId, apiOptions),
        ]);
        return {
          ...embed,
          responseHeaders,
          article: article ? { ...article, resource } : undefined,
        };
      } catch (error) {
        getLogger().error(error);
        return embed;
      }
    }

    return embed;
  }

  const getEntryNumber = (embed: RelatedContentEmbed) => {
    const siblings = embed.embed?.parent()?.children()?.toArray() || [];

    const idx = siblings.findIndex((e) => {
      return isEqual(cheerio(e).data(), embed.data);
    });
    return idx + 1;
  };

  const embedToHTML = async (embed: RelatedContentEmbed, lang: LocaleType) => {
    if (!embed.article && !embed.data.url) {
      return { html: '' };
    }

    const relatedArticleEntryNum = getEntryNumber(embed);

    // handle externalRelatedArticles
    if (embed.data && embed.data.url && typeof embed.data.url === 'string') {
      return {
        html: render(
          <RelatedArticle
            key={`external-learning-resources-${relatedArticleEntryNum}`}
            title={embed.data.title as string}
            introduction=""
            linkInfo={`${t(lang, 'related.linkInfo')} ${
              // Get domain name only from url
              embed.data.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im)?.[1] ||
              embed.data.url
            }`}
            target="_blank"
            to={embed.data.url}
            {...mapping(relatedArticleEntryNum)['external-learning-resources']}
          />,
        ),
      };
    }
    if (!embed.article) {
      return { html: '' };
    }
    return {
      html: render(
        <RelatedArticle
          key={embed.article.id}
          title={isObject(embed.article.title) ? embed.article.title.title : ''}
          introduction={
            isObject(embed.article.metaDescription)
              ? embed.article.metaDescription.metaDescription
              : ''
          }
          target={options.isOembed ? '_blank' : undefined}
          {...getRelatedArticleProps(embed.article, relatedArticleEntryNum, options)}
        />,
      ),
    };
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
