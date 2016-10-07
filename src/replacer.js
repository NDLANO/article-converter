/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import log from './utils/logger';
import Brightcove from './figures/Brightcove';
import Image from './figures/Image';
import H5P from './figures/H5P';
import { ndlaFrontendUrl } from './config';

function createFigureMarkup(figure, lang) {
  switch (figure.resource) {
    case 'image':
      return renderToStaticMarkup(<Image align={figure.align} caption={figure.caption} image={figure.image} lang={lang} />);
    case 'brightcove':
      return renderToStaticMarkup(<Brightcove video={figure} />);
    case 'h5p':
      return renderToStaticMarkup(<H5P h5p={figure} />);
    case 'content-link':
      return `<a href="${ndlaFrontendUrl}/${lang}/article/${figure.contentId}">${figure.linkText}</a>`;
    default:
      log.warn(figure, 'Do not create markup for unknown/external resource');
      return undefined;
  }
}
export function replaceFiguresInHtml(figures, html, lang, requiredLibraries) {
  const reFigures = new RegExp(/<figure.*?>.*?<\/figure>/g);
  const reDataId = new RegExp(/data-id="(.*?)"/);

  const markup = html.replace(reFigures, (figureHtml) => {
    const id = figureHtml.match(reDataId)[1];
    const figure = figures.find(f => f.id.toString() === id);
    return createFigureMarkup(figure, lang) || '';
  });

  const scripts = requiredLibraries.map(library =>
        `<script type="${library.mediaType}" src="${library.url}"></script>`
      ).join();

  return markup + scripts;
}
