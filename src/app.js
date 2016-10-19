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
import { fetchImageResources } from './api/imageApi';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { getHtmlLang } from './locale/configureLocale';
import { contentI18N, introductionI18N, alttextsI18N, captionI18N } from './utils/i18nFieldFinder';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getAppropriateErrorResponse } from './utils/errorHelpers';

const app = express();

app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
}));

async function transformContent(content, lang, requiredLibraries) {
  const embeds = await getEmbedsFromHtml(content);

  const embedsWithResources = await Promise.all(embeds.map((embed) => {
    if (embed.resource === 'image') {
      return fetchImageResources(embed);
    }
    return embed;
  }));

  return await replaceEmbedsInHtml(embedsWithResources, content, lang, requiredLibraries);
}

async function transformIntroduction(introduction, lang) {
  const { image: imageInfo } = await fetchImageResources({ url: introduction.image });
  const altText = alttextsI18N(imageInfo, lang, true);
  const caption = defined(captionI18N(imageInfo, lang, true), '');
  return {
    image: {
      altText,
      caption,
      src: imageInfo.images.full.url,
    },
    text: introduction.introduction,
  };
}

async function fetchAndTransformArticle(articleId, lang, includeScripts = false) {
  const article = await fetchArticle(articleId);

  const content = contentI18N(article, lang, true);
  const introduction = introductionI18N(article, lang, true);

  const requiredLibraries = includeScripts ? article.requiredLibraries : [];
  const transformed = await Promise.all([
    transformContent(content, lang, requiredLibraries),
    transformIntroduction(introduction, lang),
  ]);

  return { ...article, content: transformed[0], introduction: transformed[1] };
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

app.get('/article-oembed/:lang/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;

  res.json({
    type: 'rich',
    version: '1.0', // oEmbed version
    height: 800,
    width: 600,
    html: `<iframe src="${config.ndlaApiUrl}/article-oembed/html/${lang}/${articleId}"`,
  });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
