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
import cors from 'cors';
import Article from './components/Article';
import config from './config';
import { fetchArticle, fetchFigureResources } from './sources/articles';
import { parseHtmlString } from './parser';
import { getFigures } from './generator';
import { getHtmlLang } from './locale/configureLocale';
import { articleI18N, titlesI18N } from './util/i18nFieldFinder';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/article-oembed', express.static('htdocs/'));

app.get('/article-oembed/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  let tempArticle = '';
  const articleId = req.params.id;
  fetchArticle(articleId)
    .then((article) => {
      tempArticle = article;
      return getFigures(articleI18N(article, lang, true));
    })
    .then((figures) => Promise.all(figures.map((figure) => {
      if (figure.resource === 'image') {
        return fetchFigureResources(figure.url, figure.id);
      } else if (figure.resource === 'brightcove') {
        return figure;
      } else if (figure.resource === 'h5p') {
        return figure;
      }
      return undefined;
    })))
    .then((figures) => parseHtmlString(figures, articleI18N(tempArticle, lang, true), lang))
    .then((html) => {
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        title: titlesI18N(tempArticle, lang, true),
        height: 800,
        width: 600,
        html: renderToStaticMarkup(<Article lang={lang} parsedArticle={html} data={tempArticle} />),
      });
    })
    .catch((err) => {
      if (config.isProduction) {
        res.status(500).json({ status: 500, text: 'Internal server error' });
      } else {
        res.status(500).json({ status: 500, text: 'Internal server error', err });
      }
    }

  );
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
