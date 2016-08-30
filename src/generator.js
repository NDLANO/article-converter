/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';

function generateFigureObject(figure) {
  switch (figure.data('resource')) {
    case 'image':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), size: figure.data('size'), url: figure.data('url') });
    case 'brightcove':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), figure: { account: figure.data('account'), player: figure.data('player'), videoid: figure.data('videoid') } });
    case 'h5p':
      return Object.assign({ id: figure.data('id'), resource: figure.data('resource'), figure: { url: figure.data('url') } });
    default:
      return undefined;
  }
}

export function getFigures(content) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: content,
      scripts: ['http://code.jquery.com/jquery.js'],
      done: (err, window) => {
        if (err) {
          reject(err);
        }
        const $ = window.$;
        resolve($('figure').map((i, figure) => generateFigureObject($(figure))).toArray());
      },
    });
  });
}
