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
import phantom from 'phantom';
import cors from 'cors';
import config from './config';
import { fetchArticle } from './api/articleApi';
import { getHtmlLang, isValidLocale } from './locale/configureLocale';
import { titleI18N, contentI18N, footNotesI18N, introductionI18N } from './utils/i18nFieldFinder';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { transformContentAndExtractCopyrightInfo } from './transformers';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import { computeHeightWithCountingAlgorithm } from './utils/iframeHeight';

const app = express();
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use('/article-oembed', express.static('public'));

async function fetchAndTransformArticle(articleId, lang, includeScripts = false) {
  const article = await fetchArticle(articleId);

  const rawContent = contentI18N(article, lang, true);
  const footNotes = footNotesI18N(article, lang, true);
  const rawIntroduction = introductionI18N(article, lang, true);
  const title = titleI18N(article, lang, true);

  const introduction = rawIntroduction ? rawIntroduction.introduction : '';
  const requiredLibraries = includeScripts ? article.requiredLibraries : [];
  const content = await transformContentAndExtractCopyrightInfo(rawContent, lang, requiredLibraries);


  return { ...article, title, content: content.html, footNotes, contentCopyrights: content.copyrights, introduction };
}

async function computeHeightWithPhantomJs(url, width, articleId, lang) {
  const instance = await phantom.create(['--load-images=no']);
  const page = await instance.createPage();

  await page.open(url);
  await page.property('resourceTimeout', 50);
  await page.property('viewportSize', { width, height: 400 });

  const dimensions = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
  }));

  await instance.exit();
  const article = await fetchAndTransformArticle(articleId, lang);
  return { dimensions, article };
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
      res.send(htmlTemplate(lang, article.content, article.introduction, article.title));
      res.end();
    }).catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).send(htmlErrorTemplate(lang, response));
    });
});

app.get('/article-oembed/height', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = req.query.url;
  if (!url) {
    res.status(404).json({ status: 404, text: 'Url not found' });
  }

  const paths = url.split('/');
  const articleId = paths.length > 5 ? paths[5] : paths[4];
  const lang = paths.length > 2 && isValidLocale(paths[3]) ? paths[3] : 'nb';
  const iframeUrl = `http://localhost:3001/article-oembed/html/${lang}/${articleId}`;

  fetchAndTransformArticle(articleId, lang)
    .then((article) => {
      const width = req.query.width ? req.query.width : 900;
      const height = computeHeightWithCountingAlgorithm(article, width);
      const html = `<iframe src="${iframeUrl}" frameborder="0" style="height:${height}px;"/>`;
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height,
        width,
        title: article.title,
        html,
      });
    }).catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).json(response);
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
  const iframeUrl = `${config.ndlaApiUrl}/article-oembed/html/${lang}/${articleId}`;
  const width = req.query.maxwidth ? req.query.maxwidth : 900;
  console.log(req.query);
  computeHeightWithPhantomJs(iframeUrl, width, articleId, lang)
    .then((data) => {
      const height = data.dimensions.scrollHeight;
      const article = data.article;
      const html = `<iframe src="${iframeUrl}" frameborder="0" style="width:${width}px; height:${height}px;"/>`;
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height,
        width,
        title: article.title,
        html,
      });
    }).catch((error) => {
      const response = getAppropriateErrorResponse(error, config.isProduction);
      res.status(response.status).json(response);
    });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
