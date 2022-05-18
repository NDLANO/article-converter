/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { prettify } from '../../testHelpers';
import article13349 from './article13349';

import fetchAndTransformArticle from '../../../fetchAndTransformArticle';

// Tests that we can have a filelist inside aside
test('app/fetchAndTransformArticle 13349', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/13349?language=nb&fallback=true')
    .reply(200, article13349);
  nock('http://ndla-api').head('/files/82255/Gant%20diagram.pdf').reply(200);

  const transformed = await fetchAndTransformArticle('13349', {
    lang: 'nb',
    accessToken: 'some_token',
    feideToken: 'some_other_token',
  });
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
