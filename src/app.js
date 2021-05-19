/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import routes from './routes';
import swaggerDefinition from './swagger/swaggerDefinition';
import swaggerRoutes from './swagger/swaggerRoutes';

// Swagger settings
const swaggerOptions = {
  swaggerDefinition,
  apis: [`${__dirname}/routes.js`, `${__dirname}/swagger/swagger.yaml`],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
swaggerSpec.paths['/article-converter/raw/{language}/{article_id}:'] =
  swaggerRoutes.getRawArticle;
swaggerSpec.paths['/article-converter/json/{language}/{article_id}:'] =
  swaggerRoutes.getJsonArticle;
swaggerSpec.paths['/article-converter/html/{language}/{article_id}:'] =
  swaggerRoutes.getHtmlArticle;
swaggerSpec.paths['/article-converter/json/{language}/meta-data'] =
  swaggerRoutes.getMetaData;
swaggerSpec.paths['/article-converter/json/{language}/transform-article:'] =
  swaggerRoutes.postJsonTransformArticle;

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // To support URL-encoded bodies
    extended: true,
  })
);
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

routes.setup(app);

app.get('/article-converter/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// For local swagger-ui testing
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

export default app;
