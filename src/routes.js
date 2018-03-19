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
   *         description: 302 Found. Redirecting to /article-converter/json/{language}/{article_id}
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
   *         schema:
   *           type: object
   *           properties:
   *              id:
   *                type: integer
   *                description: The article ID.
   *                example: 1
   *              oldNdlaUrl:
   *                type: string
   *                description: The URL to the node from the old application.
   *                example: //red.ndla.no/node/179373
   *              revision:
   *                type: integer
   *                description: The article version number.
   *                example: 5
   *              title:
   *                type: string
   *                description: The article title.
   *                example: Foo article
   *              content:
   *                type: string
   *                description: The article HTML extended content.
   *                example: <section>Article HTML content</section>
   *              copyright:
   *                $ref: '#/definitions/copyright'
   *              tags:
   *                type: array
   *                description: Article tags.
   *                items:
   *                  type: string
   *                  example: ['Foo', 'Bar']
   *              requiredLibraries:
   *                type: array
   *                description: Required libraries.
   *                items:
   *                  type: string
   *                  example: ['Foo', 'Bar']
   *              metaImage:
   *                type: object
   *                description: Meta image attributes.
   *                properties:
   *                  url:
   *                    type: string
   *                    description: Meta image URL.
   *                  language:
   *                    type: string
   *                    description: Meta image language.
   *                    example: en
   *              introduction:
   *                type: string
   *                description: Article introduction.
   *                example: Introduction to FooBar
   *              metaDescription:
   *                type: string
   *                description: Meta description.
   *                example: Meta FooBar
   *              created:
   *                type: string
   *                description: Created date.
   *                example: 2018-01-19T11:52:38Z
   *              updated:
   *                type: string
   *                description: Updated date.
   *                example: 2018-01-24T14:18:56Z
   *              updatedBy:
   *                type: string
   *                description: Updated by.
   *                example: NDLA User
   *              articleType:
   *                type: string
   *                description: The Article type.
   *                example: standard
   *              supportedLanguages:
   *                type: array
   *                description: Supported Article languages.
   *                items:
   *                  type: string
   *                  example: ['nb', 'nb', 'en']
   *              metaData:
   *                type: object
   *                description: Meta data attributes.
   *                properties:
   *                  images:
   *                    type: array
   *                    description: Array of meta data images.
   *                    items:
   *                      type: object
   *                      properties:
   *                        title:
   *                          type: string
   *                          description: Meta image title
   *                          example: Foo
   *                        altText:
   *                          type: string
   *                          description: Meta image alt text
   *                          example: Bar
   *                        copyright:
   *                          $ref: '#/definitions/copyright'
   *                        src:
   *                          type: string
   *                          description: Meta image src
   *                          example: https://test.api.ndla.no/image-api/raw/tacf8f02.jpg
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
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
   *     produces:
   *       - text/html
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
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
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
