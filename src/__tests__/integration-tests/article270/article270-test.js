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

import fetchAndTransformArticle from '../../../fetchAndTransformArticle';

test('app/fetchAndTransformArticle 270', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/270?language=nb&fallback=true')
    .reply(200, article270);
  nock('http://ndla-api')
    .get((uri) => uri.includes('/oembed-proxy/v1/oembed'))
    .reply(404);
  const transformed = await fetchAndTransformArticle('270', 'nb', 'some_token', 'some_other_token');
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});

test('app/fetchAndTransformArticle 270 with visualElement', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/270?language=nb&fallback=true')
    .reply(200, article270);
  nock('http://ndla-api')
    .get((uri) => uri.includes('/oembed-proxy/v1/oembed'))
    .reply(404);
  const transformed = await fetchAndTransformArticle(
    '270',
    'nb',
    'some_token',
    'some_other_token',
    {
      showVisualElement: true,
    },
  );
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
