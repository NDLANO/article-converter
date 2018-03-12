/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import routes from './api/routes';
import swaggerDefinition from './swaggerDefinition';

// Swagger settings
const swaggerJSDocOptions = {
  swaggerDefinition,
  apis: [`${__dirname}/api/routes.js`, `${__dirname}/api/swagger/swagger.yaml`],
};
const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

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

app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

export default app;
