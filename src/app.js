/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import defined from 'defined';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import { fetchArticle, fetchFigureResources } from './sources/articles';
import { replaceFiguresInHtml } from './replacer';
import { getFiguresFromHtml } from './parser';
import { getHtmlLang } from './locale/configureLocale';
import { articleI18N, titlesI18N } from './util/i18nFieldFinder';

const app = express();

app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/article-oembed', express.static('htdocs/'));

async function fetchAndTransformArticle(articleId, lang) {
  const article = await fetchArticle(articleId);

  const articleHtml = articleI18N(article, lang, true);

  const figures = await getFiguresFromHtml(articleHtml);

  const figuresWithResources = await Promise.all(figures.map((figure) => {
    if (figure.resource === 'image') {
      return fetchFigureResources(figure.url, figure.id, figure.resource);
    }
    return figure;
  }));

  const html = await replaceFiguresInHtml(figuresWithResources, articleHtml, lang);

  delete article.article;

  return { ...article, html };
}

function articleToOembed(article, lang) {
  const title = titlesI18N(article, lang, true);

  return {
    type: 'rich',
    version: '1.0', // oEmbed version
    title,
    height: 800,
    width: 600,
    html: article.html,
  };
}

app.get('/article-oembed/with-meta-data/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchAndTransformArticle(articleId, lang)
    .then((article) => {
      res.json(article);
    }).catch((err) => {
      if (config.isProduction) {
        res.status(500).json({ status: 500, text: 'Internal server error' });
      } else {
        res.status(500).json({ status: 500, text: 'Internal server error', err });
      }
    });
});

app.get('/article-oembed/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchAndTransformArticle(articleId, lang)
    .then((article) => {
      res.json(articleToOembed(article));
    }).catch((err) => {
      if (config.isProduction) {
        res.status(500).json({ status: 500, text: 'Internal server error' });
      } else {
        res.status(500).json({ status: 500, text: 'Internal server error', err });
      }
    });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
