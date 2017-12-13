/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { prettify } from './testHelpers';
import article270 from './articles/article-270';
import article1036 from './articles/article-1036';
import article116 from './articles/article-116';
import article2139 from './articles/article-2139';
import image2357 from './images/image-2357';
import image347 from './images/image-347';
import video125442 from './brightcove/video-125442';
import videoSources125442 from './brightcove/video-sources-125442';

import { fetchAndTransformArticle } from '../app';

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
