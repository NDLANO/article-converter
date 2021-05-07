/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { fetchOembed } from '../oembedProxyApi';

test('Converts youtube http-url to https', async () => {
  nock('http://ndla-api')
    .get('/oembed-proxy/v1/oembed?url=https://youtube.com/videoid')
    .reply(200, {
      html: '<iframe src="https://youtube.com/videoid"></iframe>',
    });

  const oembed = {
    data: {
      url: 'http://youtube.com/videoid',
    },
  };
  const result = await fetchOembed(oembed);
  expect(result).toMatchSnapshot();
});

test('Leaves youtube https-url be', async () => {
  nock('http://ndla-api')
    .get('/oembed-proxy/v1/oembed?url=https://youtube.com/anotherid')
    .reply(200, {
      html: '<iframe src="https://youtube.com/anotherid"></iframe>',
    });

  const oembed = {
    data: {
      url: 'https://youtube.com/anotherid',
    },
  };
  const result = await fetchOembed(oembed);
  expect(result).toMatchSnapshot();
});
