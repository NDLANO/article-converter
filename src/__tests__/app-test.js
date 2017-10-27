/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import prettier from 'prettier';
import article270 from './articles/article-270';
import article1036 from './articles/article-1036';
import image2357 from './images/image-2357';

import { fetchAndTransformArticle } from '../app';

// Use prettier to format html for better diffing. N.B. prettier html formating is currently experimental
const prettify = content => prettier.format(`${content}`, { parser: 'parse5' });

test('app/fetchAndTransformArticle 270', async () => {
  nock('https://test.api.ndla.no')
    .get('/article-api/v2/articles/270?language=nb')
    .reply(200, article270);
  const transformed = await fetchAndTransformArticle('270', 'nb', 'some_token');
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});

test('app/fetchAndTransformArticle 1036', async () => {
  nock('https://test.api.ndla.no')
    .get('/article-api/v2/articles/1036?language=nb')
    .reply(200, article1036);

  nock('https://test.api.ndla.no')
    .get('/image-api/v2/images/2357')
    .reply(200, image2357);

  const transformed = await fetchAndTransformArticle(
    '1036',
    'nb',
    'some_token'
  );
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
