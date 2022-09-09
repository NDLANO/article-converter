/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { loglessTest, prettify } from '../../testHelpers';
import article4835 from './article4835';

import fetchAndTransformArticle from '../../../fetchAndTransformArticle';

loglessTest('app/fetchAndTransformArticle 4835', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/4835?language=nb&fallback=true')
    .reply(200, article4835);
  nock('http://ndla-api').head('/files/103066/1p_arsplan_2013-2014_nynorsk.doc').reply(200);
  nock('http://ndla-api').head('/files/103066/1p_arsplan_2013-2014_nynorsk.odt').reply(200);
  nock('http://ndla-api').head('/files/103066/1p_arsplan_2013-2014_nynorsk.pdf').reply(200);

  const transformed = await fetchAndTransformArticle('4835', {
    lang: 'nb',
    accessToken: 'some_token',
    feideToken: 'some_other_token',
  });
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
