/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import fetchAndTransformArticle from './fetchAndTransformArticle';
import { htmlTemplate, htmlErrorTemplate } from './utils/htmlTemplates';
import { getHtmlLang } from './locale/configureLocale';
import { getAppropriateErrorResponse } from './utils/errorHelpers';
import config from './config';
import log from './utils/logger';

// Sets up the routes.
module.exports.setup = function routes(app) {
  // article-converter routes

  /**
   * @swagger
   * /article-converter/raw/{language}/{article_id}:
   *   get:
   *     summary: Raw endpoint that redirects to the JSON endpoint
   *     parameters:
   *       - in: path
   *         name: language
   *         description: The ISO 639-1 language code describing language.
   *         required: true
   *         type: string
   *       - in: path
   *         name: article_id
   *         description: Id of the article that is to be fecthed.
   *         required: true
   *         minimum: 1
   *         type: integer
   *         format: int64
   *     responses:
   *       302:
   *         description: 302 Redirect
   */
  app.get('/article-converter/raw/:lang/:id', (req, res) => {
    const url = req.url.replace('raw', 'json');
    res.redirect(url);
  });

  /**
   * @swagger
   * /article-converter/json/{language}/{article_id}:
   *
   *   get:
   *     summary: Returns an extended and transformed json structure based on the one provided by article-api
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: language
   *         description: The ISO 639-1 language code describing language.
   *         required: true
   *         type: string
   *       - in: path
   *         name: article_id
   *         description: Id of the article that is to be fecthed.
   *         required: true
   *         minimum: 1
   *         type: integer
   *         format: int64
   *       - $ref: '#/parameters/authorizationHeader'
   *     security:
   *       - oauth2: []
   *     responses:
   *       200:
   *         description: OK
   */
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
        log.error(error);
        const response = getAppropriateErrorResponse(
          error,
          config.isProduction
        );
        res.status(response.status).json(response);
      });
  });

  /**
   * @swagger
   * /article-converter/html/{language}/{article_id}:
   *   get:
   *     summary: Returns the content attribute from article-api transformed to plain html and wrapped in a HTML document (useful for testing)
   *     parameters:
   *       - in: path
   *         name: language
   *         description: The ISO 639-1 language code describing language.
   *         required: true
   *         type: string
   *       - in: path
   *         name: article_id
   *         description: Id of the article that is to be fecthed.
   *         required: true
   *         minimum: 1
   *         type: integer
   *         format: int64
   *       - $ref: '#/parameters/authorizationHeader'
   *     security:
   *       - oauth2: []
   *     responses:
   *       200:
   *         description: OK
   */
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
        log.error(error);
        const response = getAppropriateErrorResponse(
          error,
          config.isProduction
        );
        res.status(response.status).send(htmlErrorTemplate(lang, response));
      });
  });
};
