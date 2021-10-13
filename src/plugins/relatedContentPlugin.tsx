/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// @ts-ignore
import { RelatedArticle } from '@ndla/ui/lib/RelatedArticleList';
import cheerio from 'cheerio';
import ContentTypeBadge from '@ndla/ui/lib/ContentTypeBadge';
import constants from '@ndla/ui/lib/model';
import { isObject } from 'lodash/fp';
import log from '../utils/logger';
import { ArticleApiType, fetchArticle } from '../api/articleApi';
import { ArticleResource, fetchArticleResource } from '../api/taxonomyApi';
import t from '../locale/i18n';
import { render } from '../utils/render';
import { Plugin, EmbedType, LocaleType, TransformOptions } from '../interfaces';

const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
const RESOURCE_TYPE_TASKS_AND_ACTIVITIES = 'urn:resourcetype:tasksAndActivities';

const mapping = (
  relatedArticleEntryNum: number,
): Record<
  string,
  {
    icon: React.ReactNode;
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
  filters: string | undefined,
  subject: string | undefined,
) => {
  if (!article.resource) {
    return {
      ...mapping(relatedArticleEntryNum).default,
      to: `/article/${article.id}`,
    };
  }

  const path =
    (article.resource.paths &&
      article.resource.paths.find(
        (p) => subject && p.split('/')[1] === subject.replace('urn:', ''),
      )) ||
    article.resource.path;

  let to = path;
  if (filters) {
    to = to + `?filters=${filters}`;
  }

  const resourceType = article.resource.resourceTypes.find(
    (type) => mapping(relatedArticleEntryNum)[type.id],
  );

  if (resourceType) {
    return { ...mapping(relatedArticleEntryNum)[resourceType.id], to };
  }
  return { ...mapping(relatedArticleEntryNum).default, to };
};

type RelatedArticleType = ArticleApiType & { resource?: ArticleResource };

export interface RelatedContentEmbedType extends EmbedType {
  article?: RelatedArticleType;
}

export interface RelatedContentPlugin extends Plugin<RelatedContentEmbedType> {
  resource: 'related-content';
}

export default function createRelatedContentPlugin(
  options: TransformOptions = {},
): RelatedContentPlugin {
  async function fetchResource(
    embed: EmbedType,
    accessToken: string,
    language: LocaleType,
  ): Promise<RelatedContentEmbedType> {
    if (!embed.data) return embed;

    const articleId = embed.data.articleId;

    if (articleId && (typeof articleId === 'string' || typeof articleId === 'number')) {
      try {
        const [article, resource] = await Promise.all([
          fetchArticle(articleId, accessToken, language),
          fetchArticleResource(articleId, accessToken, language),
        ]);
        return {
          ...embed,
          article: article ? { ...article, resource } : undefined,
        };
      } catch (error) {
        log.error(error);
        return embed;
      }
    }

    return embed;
  }

  const getEntryNumber = (embed: EmbedType) => {
    const siblings = embed.embed?.parent()?.children()?.toArray() || [];

    const idx = siblings.findIndex((e) => {
      return cheerio(e).data() === embed.data;
    });
    return idx + 1;
  };

  const embedToHTML = async (embed: RelatedContentEmbedType, lang: LocaleType) => {
    if (!embed.article && !embed.data.url) {
      return '';
    }

    const relatedArticleEntryNum = getEntryNumber(embed);

    // handle externalRelatedArticles
    if (embed.data && embed.data.url && typeof embed.data.url === 'string') {
      return render(
        <RelatedArticle
          key={`external-learning-resources-${relatedArticleEntryNum}`}
          title={embed.data.title}
          introduction={embed.data.metaDescription || embed.data.url}
          linkInfo={`${t(lang, 'related.linkInfo')} ${
            // Get domain name only from url
            embed.data.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im)?.[1] ||
            embed.data.url
          }`}
          target="_blank"
          to={embed.data.url}
          {...mapping(relatedArticleEntryNum)['external-learning-resources']}
        />,
      );
    }
    if (!embed.article) {
      return '';
    }
    return render(
      <RelatedArticle
        key={embed.article.id}
        title={isObject(embed.article.title) ? embed.article.title.title : ''}
        introduction={
          isObject(embed.article.metaDescription)
            ? embed.article.metaDescription.metaDescription
            : ''
        }
        target={options.isOembed ? '_blank' : null}
        {...getRelatedArticleProps(
          embed.article,
          relatedArticleEntryNum,
          options.filters,
          options.subject,
        )}
      />,
    );
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
