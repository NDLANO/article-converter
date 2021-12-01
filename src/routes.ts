/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { Express, Response } from 'express';
import fetchAndTransformArticle, { transformArticle } from './fetchAndTransformArticle';
import fetchEmbedMetaData from './fetchEmbedMetaData';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getHtmlLang } from './locale/configureLocale';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import config from './config';
import log from './utils/logger';
import { ResponseHeaders } from './interfaces';

const getAsString = (value: any): string => {
  return typeof value === 'string' ? value : '';
};

const setHeaders = (res: Response, headers: ResponseHeaders): void => {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

// Sets up the routes.
const setup = function routes(app: Express) {
  app.get('/article-converter/json/:lang/meta-data', (req, res) => {
    const embed = getAsString(req.query.embed);
    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const lang = getHtmlLang(defined(req.params.lang, ''));
    fetchEmbedMetaData(embed, accessToken, lang, feideToken)
      .then((data) => {
        res.json({
          metaData: data,
        });
      })
      .catch((error) => {
        log.error(error);
        const response = getAppropriateErrorResponse(error, config.isProduction);
        res.status(response.status).json(response);
      });
  });

  app.get('/article-converter/raw/:lang/:id', (req, res) => {
    const url = req.url.replace('raw', 'json');
    res.redirect(url);
  });

  app.get('/article-converter/json/:lang/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const isOembed =
      defined(req.query.isOembed, 'false') || defined(req.query.removeRelatedContent, 'false');
    const showVisualElement = defined(req.query.showVisualElement, 'false');
    const articleId = req.params.id;
    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const filters = req.query.filters;
    const subject = req.query.subject;
    const path = req.query.path;
    fetchAndTransformArticle(articleId, lang, accessToken, feideToken, {
      isOembed: isOembed === 'true',
      showVisualElement: showVisualElement === 'true',
      filters,
      subject,
      path,
    })
      .then((article) => {
        setHeaders(res, article.headerData);
        res.json(article);
      })
      .catch((error) => {
        log.error(error);
        const response = getAppropriateErrorResponse(error, config.isProduction);
        res.status(response.status).json(response);
      });
  });

  app.get('/article-converter/html/:lang/:id', (req, res) => {
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const articleId = req.params.id;
    const isOembed =
      defined(req.query.isOembed, 'false') || defined(req.query.removeRelatedContent, 'false');
    const showVisualElement = defined(req.query.showVisualElement, 'false');
    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const filters = req.query.filters;
    const subject = req.query.subject;
    const path = req.query.path;
    fetchAndTransformArticle(articleId, lang, accessToken, feideToken, {
      isOembed: isOembed === 'true',
      showVisualElement: showVisualElement === 'true',
      filters,
      subject,
      path,
    })
      .then((article) => {
        setHeaders(res, article.headerData);
        res.send(htmlTemplate(lang, article.title, article));
        res.end();
      })
      .catch((error) => {
        log.error(error);
        const response = getAppropriateErrorResponse(error, config.isProduction);
        const rp = htmlErrorTemplate(lang, response);
        res.status(response.status).send(rp);
      });
  });

  app.post('/article-converter/json/:lang/transform-article', (req, res) => {
    const body = req.body;
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const draftConcept = req.query.draftConcept === 'true';
    const previewH5p = req.query.previewH5p === 'true';
    const showVisualElement = req.query.showVisualElement === 'true';

    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    if (body && body.article) {
      transformArticle(body.article, {}, lang, accessToken, feideToken, {
        showVisualElement,
        draftConcept,
        previewH5p,
      })
        .then((article) => {
          setHeaders(res, article.headerData);
          res.json(article);
        })
        .catch((error) => {
          log.error(error);
          const response = getAppropriateErrorResponse(error, config.isProduction);
          res.status(response.status).json(response);
        });
    } else {
      log.error('Missing body with article.');
      const response = getAppropriateErrorResponse(
        {
          message: 'Missing body with article.',
        },
        config.isProduction,
      );
      res.status(response.status).json(response);
    }
  });
};
export default setup;
