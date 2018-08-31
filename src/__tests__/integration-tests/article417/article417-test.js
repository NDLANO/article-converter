/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import bunyan from 'bunyan';
import { prettify } from '../../testHelpers';
import article417 from './article417';
import articleResource413 from './articleResource413';
import articleResource414 from './articleResource414';
import fetchAndTransformArticle from '../../../fetchAndTransformArticle';
import log from '../../../utils/logger';

const resources = {
  '413': articleResource413,
  '414': articleResource414,
  '416': articleResource413,
};

test('app/fetchAndTransformArticle 417', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/417?language=nb&fallback=true')
    .reply(200, article417);
  ['413', '414', '416'].forEach(id => {
    nock('http://ndla-api')
      .get(`/article-api/v2/articles/${id}?language=nb&fallback=true`)
      .reply(200, article417);
    nock('http://ndla-api')
      .get(
        `/taxonomy/v1/queries/resources?contentURI=urn:article:${id}&language=nb`
      )
      .reply(200, resources[id]);
  });

  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const transformed = await fetchAndTransformArticle('417', 'nb', 'some_token');
  const { content, ...rest } = transformed;

  log.level(bunyan.INFO);

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
