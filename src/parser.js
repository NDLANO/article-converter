import jsdom from 'jsdom';
import React from 'react';
import Brightcove from './figures/Brightcove';
import Image from './figures/Image';
import H5P from './figures/H5P';

import { renderToString } from 'react-dom/server';

function parser(element, figure, lang) {
  switch (element.data('resource')) {
    case 'image':
      return renderToString(<Image image={figure} lang={lang} />);
    case 'brightcove':
      return renderToString(<Brightcove video={figure} />);
    case 'h5p':
      return renderToString(<H5P h5p={figure} />);
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
      }
    });
  });
}
