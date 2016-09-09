/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import 'isomorphic-fetch';
import defined from 'defined';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import log from './logger';
import Article from './components/Article';
import config from './config';
import { fetchArticle, fetchFigureResources } from './sources/articles';
import { replaceFiguresInHtml } from './replacer';
import { getFigures } from './generator';
import { getHtmlLang } from './locale/configureLocale';
import { articleI18N, titlesI18N } from './util/i18nFieldFinder';

const app = express();

app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/article-oembed', express.static('htdocs/'));


async function fetchAndTransformArticleToOembed(articleId, lang) {
  const article = await fetchArticle(articleId);

  const figures = await getFigures(articleI18N(article, lang, true));

  const figuresWithResources = await Promise.all(figures.map((figure) => {
    if (figure.resource === 'image') {
      return fetchFigureResources(figure.url, figure.id, figure.resource);
    } else if (figure.resource === 'brightcove') {
      return figure;
    } else if (figure.resource === 'h5p') {
      return figure;
    }
    log.warn(figure, 'Unhandled figure');
    return undefined;
  }));

  const parsedHtml = await replaceFiguresInHtml(figuresWithResources, articleI18N(article, lang, true), lang);

  return {
    type: 'rich',
    version: '1.0', // oEmbed version
    title: titlesI18N(article, lang, true),
    height: 800,
    width: 600,
    html: renderToStaticMarkup(<Article lang={lang} parsedArticle={parsedHtml} data={article} />),
  };
}


app.get('/article-oembed/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchAndTransformArticleToOembed(articleId, lang)
    .then((json) => {
      res.json(json);
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
