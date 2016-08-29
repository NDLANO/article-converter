/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import 'isomorphic-fetch';
import defined from 'defined';
import express from 'express';
import Html from './Html';
import Content from '../src/components/Content';
import NotFound from '../src/components/NotFound';
import { fetchContent, fetchFigureResources } from '../src/sources/content';
import { parseHtmlString } from '../src/parser';
import { getFigures } from '../src/generator';
import { getHtmlLang } from '../src/locale/configureLocale';
import { contentI18N } from '../src/util/i18nFieldFinder';
const app = express();

app.use('/article-oembed', express.static('htdocs/'));

app.get('/article-oembed*/:id', (req, res) => {
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
      res.send('<!doctype html>\n'.concat(renderToString(<Html lang={lang} component={<Content lang={lang} parsedContent={html} data={tempContent} />} />)));
      res.end();
    })
    .catch((err) => {
      res.send('<!doctype html>\n'.concat(renderToString(<Html lang={lang} component={<NotFound errorMessage={err} />} />)));
      res.end();
    }
  );
});

app.get('*', (req, res) => {
  res.send('<!doctype html>\n'.concat(renderToString(<Html component={<NotFound />} />)));
  res.end();
});

module.exports = app;
