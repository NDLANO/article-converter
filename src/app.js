import React from 'react';
import { renderToString } from 'react-dom/server';
import 'isomorphic-fetch';
import express from 'express';
import Html from './Html';
import Content from './Content';
import NotFound from './NotFound';
import { fetchResource } from './sources';
import { parseHtmlString } from './parser';
const app = express();

app.use(express.static('htdocs/'));

app.get('/:id/content', (req, res) => {
  fetchResource('http://api.test.ndla.no/content/'.concat(req.params.id))
    .then((content) => {
      parseHtmlString(content.content[0].content, (parsedContent) => {
        parsedContent.then((con) => {
          res.send('<!doctype html>\n'.concat(renderToString(<Html component={<Content parsedContent={con} data={content} />} />))); // eslint-disable-lint
          res.end();
        });
      });
    })
    .catch((err) => {
      res.send('<!doctype html>\n'.concat(renderToString(<Html component={<NotFound errorMessage={err} />} />))); // eslint-disable-lint
      res.end();
    }
  );
});

app.get('*', (req, res) => {
  res.send('<!doctype html>\n' + renderToString(<Html component={<NotFound />}/>)); // eslint-disable-line
});

module.exports = app;
