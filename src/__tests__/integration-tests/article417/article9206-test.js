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
import article9206 from './article9206';
import articleResource1128 from './articleResource1128';
import articleResource9202 from './articleResource9202';
import fetchAndTransformArticle from '../../../fetchAndTransformArticle';
import log from '../../../utils/logger';

const resources = {
  '1128': articleResource1128,
  '9202': articleResource9202,
  '1129': articleResource1128,
};

test('app/fetchAndTransformArticle 9206', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/9206?language=nb&fallback=true')
    .reply(200, article9206);
  ['1128', '9202', '1129'].forEach(id => {
    nock('http://ndla-api')
      .get(`/article-api/v2/articles/${id}?language=nb&fallback=true`)
      .reply(200, article9206);
    nock('http://ndla-api')
      .get(
        `/taxonomy/v1/resources?contentURI=urn:article:${id}&language=nb`
      )
      .reply(200, resources[id]);
  });

  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const transformed = await fetchAndTransformArticle(
    '9206',
    'nb',
    'some_token'
  );
  const { content, ...rest } = transformed;

  log.level(bunyan.INFO);

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
