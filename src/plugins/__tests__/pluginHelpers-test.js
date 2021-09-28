/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCopyString, makeIframe, wrapInFigure } from '../pluginHelpers';

test('wrapInFigure', () => {
  expect(wrapInFigure('<div></div>')).toMatchSnapshot();
  expect(wrapInFigure('<div></div>', false)).toMatchSnapshot();
});

test('makeIframe', () => {
  expect(makeIframe('https://youtube.com', '400', '600')).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', 400, 600)).toMatchSnapshot();
  expect(
    makeIframe('https://youtube.com', '400px', '600px', 'https://youtube.com'),
  ).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', '400 px', '600 px', 'Youtube')).toMatchSnapshot();
});

test('getCopyString from image with all properties', () => {
  const copyright = {
    license: 'CC-BY-SA-4.0',
    creators: [{ type: 'photographer', name: 'Foto Graf' }],
    rightsholders: [{ type: 'publisher', name: 'Scanpix' }],
    processors: [{ type: 'processor', name: 'Bear Beider' }],
  };
  expect(
    getCopyString('Title', 'http://api.ndla.no/image/raw/1', undefined, copyright, 'nb'),
  ).toMatchSnapshot();
});

test('getCopyString from brightcove with missing type due to typo', () => {
  const copyright = {
    license: 'CC-BY-SA-4.0',
    creators: [{ type: '', name: 'Video Kunstner' }],
    rightsholders: [{ type: 'publisher', name: 'Scanpix' }],
  };
  expect(getCopyString('Title', undefined, '/article/123', copyright, 'nb')).toMatchSnapshot();
});
