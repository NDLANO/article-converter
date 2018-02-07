/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RelatedArticleList, {
  RelatedArticle,
} from 'ndla-ui/lib/RelatedArticleList';
import ContentTypeBadge from 'ndla-ui/lib/ContentTypeBadge';
import constants from 'ndla-ui/lib/model';
import log from '../utils/logger';
import { fetchArticle } from '../api/articleApi';
import { fetchArticleResource } from '../api/taxonomyApi';

const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';

const mapping = {
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
    icon: (
      <ContentTypeBadge
        background
        type={constants.contentTypes.SUBJECT_MATERIAL}
      />
    ),
    modifier: 'subject-material',
  },
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
    icon: (
      <ContentTypeBadge
        background
        type={constants.contentTypes.TASKS_AND_ACTIVITIES}
      />
    ),
    modifier: 'tasks-and-activities',
  },
  default: {
    icon: (
      <ContentTypeBadge
        background
        type={constants.contentTypes.SUBJECT_MATERIAL}
      />
    ),
    modifier: 'subject-material',
  },
};

const getRelatedArticleProps = (resource, articleId) => {
  const to =
    resource && resource.path
      ? `/subjects${resource.path}`
      : `/article/${articleId}`;

  if (!resource || !resource.resourceTypes) {
    return { ...mapping.default, to };
  }

  const resourceType = resource.resourceTypes.find(type => mapping[type.id]);

  if (resourceType) {
    return { ...mapping[resourceType.id], to };
  }
  return { ...mapping.default, to };
};

export default function createRelatedContentPlugin() {
  async function fetchResource(embed, accessToken, lang) {
    if (!embed.data || !embed.data.articleIds) {
      return embed;
    }

    const articleIds =
      typeof embed.data.articleIds === 'number'
        ? [embed.data.articleIds]
        : embed.data.articleIds.split(',');

    const articlesWithResource = await Promise.all(
      articleIds.map(async id => {
        const [article, resource] = await Promise.all([
          fetchArticle(id, accessToken, lang).catch(error => {
            log.error(error);
            return undefined;
          }),
          fetchArticleResource(id, accessToken, lang).catch(error => {
            log.error(error);
            return undefined;
          }),
        ]);

        if (article === undefined) return undefined;
        return { ...article, resource };
      })
    );

    const articles = articlesWithResource.filter(
      article => article !== undefined
    );

    return { ...embed, articles };
  }

  const embedToHTML = embed => {
    if (!embed.articles || embed.articles.length === 0) {
      return '';
    }
    return renderToStaticMarkup(
      <RelatedArticleList messages={{ title: 'Relaterte arikler' }}>
        {embed.articles.map(article => (
          <RelatedArticle
            key={article.id}
            title={article.title.title}
            introduction={article.metaDescription.metaDescription}
            {...getRelatedArticleProps(article.resource, article.id)}
          />
        ))}
      </RelatedArticleList>
    );
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
