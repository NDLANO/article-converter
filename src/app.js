/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import 'isomorphic-fetch';
import defined from 'defined';
import express from 'express';
import cors from 'cors';
import Content from './components/Content';
import config from './config';
import { fetchContent, fetchFigureResources } from './sources/content';
import { parseHtmlString } from './parser';
import { getFigures } from './generator';
import { getHtmlLang } from './locale/configureLocale';
import { contentI18N } from './util/i18nFieldFinder';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/article-oembed', express.static('htdocs/'));

app.get('/article-oembed*/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const paths = req.url.split('/');
  const lang = getHtmlLang(defined(paths[1], ''));
  let tempContent = '';
  const contentId = req.params.id;
  fetchContent(contentId)
    .then((content) => {
      tempContent = content;
      return getFigures(contentI18N(content, lang, true));
    })
    .then((figures) => Promise.all(figures.map((figure) => {
      if (figure.resource === 'image') {
        return fetchFigureResources(figure.url, figure.id);
      } else if (figure.resource === 'brightcove') {
        return figure;
      } else if (figure.resource === 'h5p') {
        return figure;
      }
      return undefined;
    })))
    .then((figures) => parseHtmlString(figures, contentI18N(tempContent, lang, true), lang))
    .then((html) => {
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height: 800,
        width: 600,
        html: renderToStaticMarkup(<Content lang={lang} parsedContent={html} data={tempContent} />),
      });
    })
    .catch((err) => {
      if (config.isProduction) {
        res.status(500).json({ status: 500, text: 'Internal server error' });
      } else {
        res.status(500).json({ status: 500, text: 'Internal server error', err });
      }
    }

  );
});

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, text: 'Not found' });
});

module.exports = app;
