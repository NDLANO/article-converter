/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import cheerio from 'cheerio';
import defined from 'defined';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import { fetchArticle } from './api/articleApi';
import { getHtmlLang } from './locale/configureLocale';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { transform } from './transformers';
import { getAppropriateErrorResponse } from './utils/errorHelpers';

const app = express();
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

export async function fetchAndTransformArticle(articleId, lang, accessToken) {
  const article = await fetchArticle(articleId, accessToken, lang);
  const articleContent = cheerio.load(article.content.content);
  const { html, embedMetaData } = await transform(
    articleContent,
    lang,
    accessToken,
    article.visualElement
  );

  return {
    ...article,
    content: html,
    footNotes: embedMetaData.other.footnote,
    title: article.title.title,
    tags: article.tags.tags,
    introduction: article.introduction
      ? article.introduction.introduction
      : undefined,
    metaDescription: article.metaDescription.metaDescription,
    contentCopyrights: embedMetaData.copyrights,
  };
}

app.get('/article-converter/raw/:lang/:id', (req, res) => {
  const url = req.url.replace('raw', 'json');
  res.redirect(url);
});

app.get('/article-converter/json/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  const accessToken = req.headers.authorization;
  fetchAndTransformArticle(articleId, lang, accessToken)
    .then(article => {
      res.json(article);
    })
    .catch(error => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).json(response);
    });
});

app.get('/article-converter/html/:lang/:id', (req, res) => {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  const accessToken = req.headers.authorization;
  fetchAndTransformArticle(articleId, lang, accessToken, true)
    .then(article => {
      res.send(htmlTemplate(lang, article.title, article));
      res.end();
    })
    .catch(error => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).send(htmlErrorTemplate(lang, response));
    });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
