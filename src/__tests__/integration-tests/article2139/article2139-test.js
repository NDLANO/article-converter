/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { prettify } from '../../testHelpers';
import article2139 from './article2139';
import image2357 from './image2357';
import image347 from './image347';

import { fetchAndTransformArticle } from '../../../app';

test('app/fetchAndTransformArticle 2139', async () => {
  nock('https://test.api.ndla.no')
    .get('/article-api/v2/articles/2139?language=nb')
    .reply(200, article2139);

  nock('https://test.api.ndla.no')
    .get('/image-api/v2/images/859')
    .reply(200, image2357);
  nock('https://test.api.ndla.no')
    .get('/image-api/v2/images/604')
    .reply(200, image2357);
  nock('https://test.api.ndla.no')
    .get('/image-api/v2/images/3676')
    .reply(200, image347);

  const transformed = await fetchAndTransformArticle(
    '2139',
    'nb',
    'some_token'
  );
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
