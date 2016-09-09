/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import log from './logger';
import Brightcove from './figures/Brightcove';
import Image from './figures/Image';
import H5P from './figures/H5P';


function createMarkup(resource, figure, lang) {
  switch (resource) {
    case 'image':
      return renderToStaticMarkup(<Image image={figure} lang={lang} />);
    case 'brightcove':
      return renderToStaticMarkup(<Brightcove video={figure} />);
    case 'h5p':
      return renderToStaticMarkup(<H5P h5p={figure} />);
    default:
      log.warn(figure, 'Could not create markup for unknown resource');
      return undefined;
  }
}

export function replaceFiguresInHtml(figures, html, lang) {
  return figures.reduce((output, figure) => {
    const re = new RegExp(`<figure.*data-id="${figure.id}".*>.*<\/figure>`);
    const markup = createMarkup(figure.resource, figure.figure, lang);
    return markup ? output.replace(re, markup) : output;
  }, html);
}
