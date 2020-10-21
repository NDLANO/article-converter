/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { makeIframe, wrapInFigure } from '../pluginHelpers';

test('wrapInFigure', () => {
  expect(wrapInFigure('<div></div>')).toMatchSnapshot();
  expect(wrapInFigure('<div></div>', false)).toMatchSnapshot();
});

test('makeIframe', () => {
  expect(makeIframe('https://youtube.com', '400', '600')).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', 400, 600)).toMatchSnapshot();
  expect(
    makeIframe('https://youtube.com', '400px', '600px', 'https://youtube.com')
  ).toMatchSnapshot();
  expect(
    makeIframe('https://youtube.com', '400 px', '600 px', 'Youtube')
  ).toMatchSnapshot();
});
