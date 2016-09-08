/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Brightcove from './figures/Brightcove';
import Image from './figures/Image';
import H5P from './figures/H5P';


function parser(element, figure, lang) {
  switch (element.data('resource')) {
    case 'image':
      return renderToStaticMarkup(<Image image={figure} lang={lang} />);
    case 'brightcove':
      return renderToStaticMarkup(<Brightcove video={figure} />);
    case 'h5p':
      return renderToStaticMarkup(<H5P h5p={figure} />);
    case 'external':
      return undefined;
    default:
      return undefined;
  }
}

export function parseHtmlString(figures, content, lang) {
  if (!content) {
    return undefined;
  }
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: content,
      scripts: ['http://code.jquery.com/jquery.js'],
      done: (err, window) => {
        if (err) {
          reject(err);
        }
        const $ = window.$;
        $('figure').each((i, el) => {
          figures.forEach((figure) => {
            if (figure.id === $(el).data('id')) {
              $(el).replaceWith(parser($(el), figure.figure, lang));
            }
          });
        });
        resolve(window.document.documentElement.innerHTML);
      },
    });
  });
}
