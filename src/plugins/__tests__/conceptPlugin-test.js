/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import bunyan from 'bunyan';
import getLogger from '../../utils/logger';
import createConceptPlugin from '../conceptPlugin';

test('fetch concept and draft concept', async () => {
  const log = getLogger();
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  let conceptPlugin = createConceptPlugin();
  nock('http://ndla-api')
    .get(`/concept-api/v1/concepts/1?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `concept 1` },
      content: {
        content: `concept content 1`,
      },
    });

  const resource1 = await conceptPlugin.fetchResource(
    {
      data: { contentId: '1' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
    },
  );
  expect(resource1).toMatchSnapshot();

  conceptPlugin = createConceptPlugin({ draftConcept: true });
  nock('http://ndla-api')
    .get(`/concept-api/v1/drafts/2?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `concept 2` },
      content: { content: `concept content 2` },
    });

  const resource2 = await conceptPlugin.fetchResource(
    {
      data: { contentId: '2' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
    },
  );
  expect(resource2).toMatchSnapshot();

  conceptPlugin = createConceptPlugin({ draftConcept: false });
  nock('http://ndla-api')
    .get(`/concept-api/v1/concepts/3?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `concept 3` },
      content: { content: `concept content 3` },
    });

  const resource3 = await conceptPlugin.fetchResource(
    {
      data: { contentId: '3' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
    },
  );
  expect(resource3).toMatchSnapshot();

  log.level(bunyan.INFO);
});
