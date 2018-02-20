/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { prettify } from '../../testHelpers';
import article270 from './article270';

import { fetchAndTransformArticle } from '../../../app';

test('app/fetchAndTransformArticle 270', async () => {
  nock('https://test.api.ndla.no')
    .get('/article-api/v2/articles/270?language=nb&fallback=true')
    .reply(200, article270);
  const transformed = await fetchAndTransformArticle('270', 'nb', 'some_token');
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
