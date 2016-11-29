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
import { fetchArticle } from './api/articleApi';
import { getHtmlLang, isValidLocale } from './locale/configureLocale';
import { contentI18N, footNotesI18N, introductionI18N } from './utils/i18nFieldFinder';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { transformContentAndExtractCopyrightInfo } from './transformers';
import { getAppropriateErrorResponse } from './utils/errorHelpers';

const app = express();
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));


async function fetchAndTransformArticle(articleId, lang, includeScripts = false) {
  const article = await fetchArticle(articleId);

  const rawContent = contentI18N(article, lang, true);
  const footNotes = footNotesI18N(article, lang, true);
  const rawIntroduction = introductionI18N(article, lang, true);

  const introduction = rawIntroduction ? rawIntroduction.introduction : '';
  const requiredLibraries = includeScripts ? article.requiredLibraries : [];
  const content = await transformContentAndExtractCopyrightInfo(rawContent, lang, requiredLibraries);


  return { ...article, content: content.html, footNotes, contentCopyrights: content.copyrights, introduction };
}


app.get('/article-oembed/raw/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchAndTransformArticle(articleId, lang)
    .then((article) => {
      res.json(article);
    }).catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).json(response);
    });
});

app.get('/article-oembed/html/:lang/:id', (req, res) => {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchAndTransformArticle(articleId, lang, true)
    .then((article) => {
      res.send(htmlTemplate(lang, article.content));
      res.end();
    }).catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).send(htmlErrorTemplate(lang, response));
    });
});

app.get('/article-oembed', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const url = req.query.url;
  if (!url) {
    res.status(404).json({ status: 404, text: 'Url not found' });
  }
  const paths = url.split('/');
  const articleId = paths.length > 5 ? paths[5] : paths[4];
  const lang = paths.length > 2 && isValidLocale(paths[3]) ? paths[3] : 'nb';
  res.json({
    type: 'rich',
    version: '1.0', // oEmbed version
    height: 800,
    width: 600,
    html: `<iframe src="${config.ndlaApiUrl}/article-oembed/html/${lang}/${articleId}"/>`,
  });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
