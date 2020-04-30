/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import bunyan from 'bunyan';
import log from '../../utils/logger';
import createContentLinkPlugin from '../contentLinkPlugin';

const articleResource = [
  {
    resourceTypes: [
      {
        id: 'urn:resourcetype:tasksAndActivities',
        name: 'Oppgaver og aktiviteter',
      },
    ],
    path: '/subject:12/topic:1:183846/topic:1:183935/resource:1:110269',
  },
];

test('fetchResource for content-link', async () => {
  const contentLinkPlugin = createContentLinkPlugin();

  nock('http://ndla-api')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:1&language=nb`)
    .reply(200, articleResource);

  const resource = await contentLinkPlugin.fetchResource(
    {
      data: { contentId: '1' },
    },
    'token',
    'nb'
  );

  expect(resource).toMatchSnapshot();
});

const articleResourceWithoutPath = [
  {
    resourceTypes: [
      {
        id: 'urn:resourcetype:tasksAndActivities',
        name: 'Oppgaver og aktiviteter',
      },
    ],
  },
];

test('fetchResource with missing taxonomy data should fallback to path without taxonomy', async () => {
  const contentLinkPlugin = createContentLinkPlugin();

  nock('http://ndla-api')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:1&language=nb`)
    .reply(200, articleResourceWithoutPath);

  const resource = await contentLinkPlugin.fetchResource(
    {
      data: { contentId: '1' },
    },
    'token',
    'nb'
  );

  expect(resource).toMatchSnapshot();
});

test('fetchResource where taxonomy fails should fallback to path without taxonomy', async () => {
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const contentLinkPlugin = createContentLinkPlugin();
  nock('http://ndla-api')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:1`)
    .reply(500, {});

  const resource = await contentLinkPlugin.fetchResource(
    {
      data: { contentId: '1' },
    },
    '',
    'nb'
  );

  expect(resource).toEqual({
    data: { contentId: '1' },
    path: `nb/article/1`,
  });
  log.level(bunyan.INFO);
});

test('embedToHtml should return anchor tag with path', async () => {
  const contentLinkPlugin = createContentLinkPlugin();

  expect(
    contentLinkPlugin.embedToHTML(
      {
        embed: {},
        data: { linkText: 'text', contentId: '1' },
        path: 'urn:test:1',
      },
      'nb'
    )
  ).toMatchSnapshot();
});
