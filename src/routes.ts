/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Express, Response } from 'express';
import fetchAndTransformArticle, { transformArticle } from './fetchAndTransformArticle';
import fetchEmbedMetaData from './fetchEmbedMetaData';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getHtmlLang } from './locale/configureLocale';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import config from './config';
import getLogger from './utils/logger';
import { ResponseHeaders } from './interfaces';

export const getAsString = (value: any): string => {
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
    const versionHash = getAsString(req.headers['versionhash']);
    const lang = getHtmlLang(req.params.lang ?? '');
    fetchEmbedMetaData(embed, { accessToken, lang, feideToken, versionHash })
      .then((data) => {
        res.json({
          metaData: data,
        });
      })
      .catch((error) => {
        getLogger().error(error);
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
    const lang = getHtmlLang(req.params.lang ?? '');
    const isOembed = req.query.isOembed ?? req.query.removeRelatedContent ?? 'false';
    const showVisualElement = req.query.showVisualElement ?? 'false';
    const articleId = req.params.id;
    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const versionHash = getAsString(req.headers['versionhash']);
    const subject = req.query.subject;
    const path = req.query.path;
    const shortPath = `/article/${articleId}`;
    fetchAndTransformArticle(
      articleId,
      { lang, accessToken, feideToken, versionHash },
      {
        isOembed: isOembed === 'true',
        showVisualElement: showVisualElement === 'true',
        subject,
        path,
        shortPath,
      },
    )
      .then((article) => {
        setHeaders(res, article.headerData);
        res.json(article);
      })
      .catch((error) => {
        getLogger().error(error);
        const response = getAppropriateErrorResponse(error, config.isProduction);
        res.status(response.status).json(response);
      });
  });

  app.get('/article-converter/html/:lang/:id', (req, res) => {
    const lang = getHtmlLang(req.params.lang ?? '');
    const articleId = req.params.id;
    const isOembed = req.query.isOembed ?? req.query.removeRelatedContent ?? 'false';
    const showVisualElement = req.query.showVisualElement ?? 'false';
    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const versionHash = getAsString(req.headers['versionhash']);
    const subject = req.query.subject;
    const path = req.query.path;
    const shortPath = `/article/${articleId}`;
    fetchAndTransformArticle(
      articleId,
      { lang, accessToken, feideToken, versionHash },
      {
        isOembed: isOembed === 'true',
        showVisualElement: showVisualElement === 'true',
        subject,
        path,
        shortPath,
      },
    )
      .then((article) => {
        setHeaders(res, article.headerData);
        res.send(htmlTemplate(lang, article.title, article));
        res.end();
      })
      .catch((error) => {
        getLogger().error(error);
        const response = getAppropriateErrorResponse(error, config.isProduction);
        const rp = htmlErrorTemplate(lang, response);
        res.status(response.status).send(rp);
      });
  });

  app.post('/article-converter/json/:lang/transform-article', (req, res) => {
    const log = getLogger();
    const body = req.body;
    const lang = getHtmlLang(req.params.lang ?? '');
    const draftConcept = req.query.draftConcept === 'true';
    const previewH5p = req.query.previewH5p === 'true';
    const previewAlt = req.query.previewAlt === 'true';
    const showVisualElement = req.query.showVisualElement === 'true';
    const absoluteUrl = req.query.absoluteUrl === 'true';

    const accessToken = getAsString(req.headers.authorization);
    const feideToken = getAsString(req.headers['feideauthorization']);
    const versionHash = getAsString(req.headers['versionhash']);
    if (body && body.article) {
      transformArticle(
        body.article,
        {},
        { lang, accessToken, feideToken, versionHash },
        {
          showVisualElement,
          draftConcept,
          previewH5p,
          previewAlt,
          absoluteUrl,
        },
      )
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
