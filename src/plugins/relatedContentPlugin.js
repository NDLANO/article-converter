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
import { isObject } from 'lodash/fp';
import { RelatedArticleCounter } from '../utils/embedGroupHelpers';
import log from '../utils/logger';
import { fetchArticle } from '../api/articleApi';
import { fetchArticleResource } from '../api/taxonomyApi';
import t from '../locale/i18n';

const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';

const mapping = relatedArticleEntryNum => {
  const hiddenModifier = relatedArticleEntryNum > 2 ? ' hidden' : '';
  return {
    [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.SUBJECT_MATERIAL}
        />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
    [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.TASKS_AND_ACTIVITIES}
        />
      ),
      modifier: `tasks-and-activities${hiddenModifier}`,
    },
    'external-learning-resources': {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.EXTERNAL_LEARNING_RESOURCES}
        />
      ),
      modifier: `external-learning-resources${hiddenModifier}`,
    },
    default: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.SUBJECT_MATERIAL}
        />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
  };
};

const getRelatedArticleProps = (
  resource,
  articleId,
  relatedArticleEntryNum,
  url
) => {
  let to;
  if (articleId) {
    to =
      resource && resource.path
        ? `/subjects${resource.path}`
        : `/article/${articleId}`;
  } else {
    return {
      ...mapping(relatedArticleEntryNum)['external-learning-resources'],
      to: url,
    };
  }

  if (!resource || !resource.resourceTypes) {
    return { ...mapping(relatedArticleEntryNum).default, to };
  }

  const resourceType = resource.resourceTypes.find(
    type => mapping(relatedArticleEntryNum)[type.id]
  );

  if (resourceType) {
    return { ...mapping(relatedArticleEntryNum)[resourceType.id], to };
  }
  return { ...mapping(relatedArticleEntryNum).default, to };
};

export default function createRelatedContentPlugin() {
  const embedToHTMLCounter = new RelatedArticleCounter();
  async function fetchResource(embed, accessToken, lang) {
    if (!embed.data) return embed;
    if (!embed.data.articleId && !embed.data.url) return embed;

    let article;
    let resource;

    if (embed.data.articleId) {
      try {
        [article, resource] = await Promise.all([
          fetchArticle(embed.data.articleId, accessToken, lang),
          fetchArticleResource(embed.data.articleId, accessToken, lang),
        ]);
      } catch (error) {
        log.error(error);
        return undefined;
      }
    }

    if (embed.data.url) {
      article = {
        title: { title: embed.data.title },
        metaDescription: {
          metaDescription: embed.data.metaDescription || embed.data.url,
        },
        linkInfo: `${t(lang, 'related.linkInfo')} ${
          // Get domain name only from url
          embed.data.url.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im
          )[1] || embed.data.url
        }`,
        url: embed.data.url,
      };
    }

    return {
      ...embed,
      article: article ? { ...article, resource } : undefined,
    };
  }

  const embedToHTML = embed => {
    if (!embed.article) {
      return '';
    }

    const relatedArticleEntryNum = embedToHTMLCounter.getNextCount();

    return renderToStaticMarkup(
      <RelatedArticle
        key={
          embed.article.id ||
          `external-learning-resources-${relatedArticleEntryNum}`
        }
        title={isObject(embed.article.title) ? embed.article.title.title : ''}
        introduction={
          isObject(embed.article.metaDescription)
            ? embed.article.metaDescription.metaDescription
            : ''
        }
        linkInfo={embed.article.linkInfo || null}
        {...getRelatedArticleProps(
          embed.article.resource,
          embed.article.id,
          relatedArticleEntryNum,
          embed.article.url
        )}
      />
    );
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
