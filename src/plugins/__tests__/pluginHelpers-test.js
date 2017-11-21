/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { makeIframe, wrapInFigureEmbedded } from '../pluginHelpers';

test('wrapInFigureEmbed', () => {
  expect(wrapInFigureEmbedded('<div></div>')).toMatchSnapshot();
  expect(wrapInFigureEmbedded('<div></div>', false)).toMatchSnapshot();
});

test('makeIframe', () => {
  expect(makeIframe('https://youtube.com', '400', '600')).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', 400, 600)).toMatchSnapshot();
  expect(makeIframe('https://youtube.com', '400px', '600px')).toMatchSnapshot();
  expect(
    makeIframe('https://youtube.com', '400 px', '600 px')
  ).toMatchSnapshot();
});
