/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { prettify } from '../../testHelpers';
import article116 from './article116';
import video125442 from './video125442';
import videoSources125442 from './videoSources125442';

import { fetchAndTransformArticle } from '../../../app';

test('app/fetchAndTransformArticle 116', async () => {
  nock('https://test.api.ndla.no')
    .get('/article-api/v2/articles/116?language=nb')
    .reply(200, article116);
  nock('https://oauth.brightcove.com/')
    .post('/v4/access_token?grant_type=client_credentials')
    .reply(200, JSON.stringify('some_token'));
  nock('https://cms.api.brightcove.com')
    .get('/v1/accounts/4806596774001/videos/ref:125442')
    .reply(200, video125442);
  nock('https://cms.api.brightcove.com')
    .get('/v1/accounts/4806596774001/videos/ref:125442/sources')
    .reply(200, videoSources125442);

  const transformed = await fetchAndTransformArticle('116', 'nb', 'some_token');
  const { content, ...rest } = transformed;

  expect(rest).toMatchSnapshot();
  expect(prettify(content)).toMatchSnapshot();
});
