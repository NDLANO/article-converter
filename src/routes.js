/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import fetchAndTransformArticle, {
  transformArticle,
} from './fetchAndTransformArticle';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getHtmlLang } from './locale/configureLocale';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import config from './config';
import log from './utils/logger';

// Sets up the routes.
module.exports.setup = function routes(app) {
  app.get('/article-converter/raw/:lang/:id', (req, res) => {
    const url = req.url.replace('raw', 'json');
    res.redirect(url);
  });

  app.get('/article-converter/json/:lang/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const removeRelatedContent = defined(req.query.removeRelatedContent, false);
    const articleId = req.params.id;
    const accessToken = req.headers.authorization;
    const filters = req.query.filters;
    fetchAndTransformArticle(articleId, lang, accessToken, {
      removeRelatedContent,
      filters: filters,
    })
      .then(article => {
        res.json(article);
      })
      .catch(error => {
        log.error(error);
        const response = getAppropriateErrorResponse(
          error,
          config.isProduction
        );
        res.status(response.status).json(response);
      });
  });

  app.get('/article-converter/html/:lang/:id', (req, res) => {
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const articleId = req.params.id;
    const removeRelatedContent = defined(req.query.removeRelatedContent, false);
    const accessToken = req.headers.authorization;
    const filters = req.query.filters;
    fetchAndTransformArticle(articleId, lang, accessToken, {
      removeRelatedContent,
      filters: filters,
    })
      .then(article => {
        res.send(htmlTemplate(lang, article.title, article));
        res.end();
      })
      .catch(error => {
        log.error(error);
        const response = getAppropriateErrorResponse(
          error,
          config.isProduction
        );
        res.status(response.status).send(htmlErrorTemplate(lang, response));
      });
  });

  app.post('/article-converter/json/:lang/transform-article', (req, res) => {
    const body = req.body;
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const accessToken = req.headers.authorization;
    if (body && body.article) {
      transformArticle(body.article, lang, accessToken)
        .then(article => {
          res.json(article);
        })
        .catch(error => {
          log.error(error);
          const response = getAppropriateErrorResponse(
            error,
            config.isProduction
          );
          res.status(response.status).json(response);
        });
    } else {
      log.error('Missing body with article.');
      const response = getAppropriateErrorResponse(
        {
          message: 'Missing body with article.',
        },
        config.isProduction
      );
      res.status(response.status).json(response);
    }
  });
};
