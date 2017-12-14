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
import { Document, Pencil } from 'ndla-icons/common';
import log from '../utils/logger';
import { fetchArticle } from '../api/articleApi';
import { fetchArticleResource } from '../api/taxonomyApi';

const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';

const mapping = {
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
    icon: <Document />,
    modifier: 'subject-material',
  },
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
    icon: <Pencil />,
    modifier: 'tasks-and-activities',
  },
  default: {
    icon: <Document />,
    modifier: 'subject-material',
  },
};

const getRelatedArticleProps = (resource, articleId) => {
  const resourceType = resource.resourceTypes.find(type => mapping[type.id]);
  const urnPath = resource.path
    .split('/')
    .map(s => (s !== '' ? `urn:${s}` : s))
    .join('/');
  const to = `/article${urnPath}/${articleId}`;

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

    const articlesWithRespource = await Promise.all(
      articleIds.map(async id => {
        try {
          const [article, resource] = await Promise.all([
            fetchArticle(id, accessToken, lang),
            fetchArticleResource(id, accessToken, lang),
          ]);
          return { ...article, resource };
        } catch (error) {
          log.error(error);
          return undefined;
        }
      })
    );

    const articles = articlesWithRespource.filter(
      article => article !== undefined && article.resource !== undefined
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
