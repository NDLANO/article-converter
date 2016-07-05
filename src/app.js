import React from 'react';
import { renderToString } from 'react-dom/server';
import 'isomorphic-fetch';
import express from 'express';
import Html from './Html';
import Content from './Content';
import NotFound from './NotFound';
const app = express();

app.use(express.static('htdocs'));

app.get('/:id/content', (req, res) => {
  fetch('http://api.test.ndla.no/content/'.concat(req.params.id))
    .then((response) => {
      if (response.status >= 400) {
        res.send('<!doctype html>\n'.concat(renderToString(<Html component={<NotFound />} />))); // eslint-disable-lint
        res.end();
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((data) => {
      res.send('<!doctype html>\n'.concat(renderToString(<Html component={<Content data={data} />} />))); // eslint-disable-lint
      res.end();
    });
});

app.get('*', (req, res) => {
  res.send('<!doctype html>\n' + renderToString(<Html component={<NotFound />}/>)); // eslint-disable-line
});

module.exports = app;
