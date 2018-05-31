/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RelatedArticle } from 'ndla-ui/lib/RelatedArticleList';
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
    if (!embed.data || !embed.data.articleId) {
      return embed;
    }

    const [article, resource] = await Promise.all([
      fetchArticle(embed.data.articleId, accessToken, lang).catch(error => {
        log.error(error);
        return undefined;
      }),
      fetchArticleResource(embed.data.articleId, accessToken, lang).catch(
        error => {
          log.error(error);
          return undefined;
        }
      ),
    ]);

    return {
      ...embed,
      article: article ? { ...article, resource } : undefined,
    };
  }

  const embedToHTML = embed => {
    if (!embed.article) {
      return '';
    }
    return renderToStaticMarkup(
      <RelatedArticle
        key={embed.article.id}
        title={embed.article.title.title}
        introduction={embed.article.metaDescription.metaDescription}
        {...getRelatedArticleProps(embed.article.resource, embed.article.id)}
      />
    );
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
