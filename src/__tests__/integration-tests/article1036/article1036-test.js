/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { loglessTest, prettify } from '../../testHelpers';
import article1036 from './article1036';
import image2357 from './image2357';

import fetchAndTransformArticle from '../../../fetchAndTransformArticle';

loglessTest('app/fetchAndTransformArticle 1036', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/1036?language=nb&fallback=true')
    .reply(200, article1036);

  nock('http://ndla-api').get('/image-api/v2/images/2357?language=nb').reply(200, image2357);

  const transformed = await fetchAndTransformArticle('1036', {
    lang: 'nb',
    accessToken: 'some_token',
    feideToken: 'some_other_token',
  });
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
