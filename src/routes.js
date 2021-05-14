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
import fetchEmbedMetaData from './fetchEmbedMetaData';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getHtmlLang } from './locale/configureLocale';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import config from './config';
import log from './utils/logger';

// Sets up the routes.
module.exports.setup = function routes(app) {
  app.get('/article-converter/json/:lang/meta-data', (req, res) => {
    const embed = req.query.embed;
    const accessToken = req.headers.authorization;
    const lang = getHtmlLang(defined(req.params.lang, ''));
    fetchEmbedMetaData(embed, accessToken, lang)
      .then(data => {
        res.json(data);
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

  app.get('/article-converter/raw/:lang/:id', (req, res) => {
    const url = req.url.replace('raw', 'json');
    res.redirect(url);
  });

  app.get('/article-converter/json/:lang/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const lang = getHtmlLang(defined(req.params.lang, ''));
    const isOembed =
      defined(req.query.isOembed, 'false') ||
      defined(req.query.removeRelatedContent, 'false');
    const articleId = req.params.id;
    const accessToken = req.headers.authorization;
    const filters = req.query.filters;
    const subject = req.query.subject;
    fetchAndTransformArticle(articleId, lang, accessToken, {
      isOembed: isOembed === 'true',
      filters,
      subject,
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
    const isOembed =
      defined(req.query.isOembed, 'false') ||
      defined(req.query.removeRelatedContent, 'false');
    const accessToken = req.headers.authorization;
    const filters = req.query.filters;
    const subject = req.query.subject;
    fetchAndTransformArticle(articleId, lang, accessToken, {
      isOembed: isOembed === 'true',
      filters,
      subject,
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
    const draftConcept = defined(req.query.draftConcept, false);
    const previewH5p = defined(req.query.previewH5p, false);
    const accessToken = req.headers.authorization;
    if (body && body.article) {
      transformArticle(body.article, lang, accessToken, {
        draftConcept,
        previewH5p,
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
