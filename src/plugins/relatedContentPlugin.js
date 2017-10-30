/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RelatedArticles from 'ndla-ui/lib/RelatedArticles/RelatedArticles';
import { fetchArticle } from '../api/articleApi';

export default function createRelatedContentPlugin() {
  function fetchResource(embed, accessToken, lang) {
    const articleIds =
      typeof embed.data.articleIds === 'number'
        ? [embed.data.articleIds]
        : embed.data.articleIds.split(',');
    return new Promise(async resolve => {
      const articles = await Promise.all(
        articleIds.map(id => fetchArticle(id, accessToken, lang))
      );
      resolve({ ...embed, articles });
    });
  }

  const embedToHTML = embed => {
    const articles = embed.articles.map(article => ({
      path: `/article/${article.id}`,
      title: article.title.title,
      introduction: article.metaDescription.metaDescription,
    }));

    return renderToStaticMarkup(<RelatedArticles resources={articles} />);
  };

  return {
    resource: 'related-content',
    fetchResource,
    embedToHTML,
  };
}
