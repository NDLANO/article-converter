/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import bunyan from 'bunyan';
import log from '../../utils/logger';
import createRelatedContentPlugin from '../relatedContentPlugin';

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

test('fetchResource when no article ids is provided', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();
  const resource = await relatedContentPlugin.fetchResource({ data: {} });
  expect(resource).toEqual({ data: {} });
});

test('fetchResource for two related articles', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  ['1', '2'].forEach(id => {
    nock('https://test.api.ndla.no')
      .get(`/article-api/v2/articles/${id}?language=nb`)
      .reply(200, {
        title: { title: `title${id}` },
        introduction: { introduction: `introduction${id}` },
      });
    nock('https://test.api.ndla.no')
      .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:${id}`)
      .reply(200, articleResource);
  });

  const resource = await relatedContentPlugin.fetchResource(
    {
      data: { articleIds: '1,2' },
    },
    'token',
    'nb'
  );

  expect(resource).toMatchSnapshot();
});

test('fetchResource for two related articles, where one could not be fetched from article-api', async () => {
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const relatedContentPlugin = createRelatedContentPlugin();
  nock('https://test.api.ndla.no')
    .get(`/article-api/v2/articles/1?language=nb`)
    .reply(200, {
      title: { title: `title1` },
      introduction: { introduction: `introduction1` },
    });

  nock('https://test.api.ndla.no')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:1`)
    .reply(200, articleResource);

  nock('https://test.api.ndla.no')
    .get(`/article-api/v2/articles/2?language=nb`)
    .reply(501, {});

  const resource = await relatedContentPlugin.fetchResource(
    {
      data: { articleIds: '1,2' },
    },
    'token',
    'nb'
  );

  expect(resource).toMatchSnapshot();
  log.level(bunyan.INFO);
});

test('fetchResource for two related articles, where one could not be fetched from taxonomy-api', async () => {
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const relatedContentPlugin = createRelatedContentPlugin();
  nock('https://test.api.ndla.no')
    .get(`/article-api/v2/articles/1?language=nb`)
    .reply(200, {
      title: { title: `title1` },
      introduction: { introduction: `introduction1` },
    });
  nock('https://test.api.ndla.no')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:1`)
    .reply(200, articleResource);

  nock('https://test.api.ndla.no')
    .get(`/article-api/v2/articles/2?language=nb`)
    .reply(200, {
      title: { title: `title2` },
      introduction: { introduction: `introduction2` },
    });
  nock('https://test.api.ndla.no')
    .get(`/taxonomy/v1/queries/resources?contentURI=urn:article:2`)
    .reply(500, {});

  const resource = await relatedContentPlugin.fetchResource(
    {
      data: { articleIds: '1,2' },
    },
    'token',
    'nb'
  );

  expect(resource).toMatchSnapshot();
  log.level(bunyan.INFO);
});

test('embedToHtml should return empty string if no related articles is provided', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  expect(relatedContentPlugin.embedToHTML({ embed: {} })).toBe('');
  expect(relatedContentPlugin.embedToHTML({ embed: { articles: [] } })).toBe(
    ''
  );
});

test('embedToHtml should return fallback url if no resource was found', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  const embed = {
    data: { articleIds: '1231,1232,1145', resource: 'related-content' },
    articles: [
      {
        id: 1231,
        title: { title: 't1' },
        metaDescription: { metaDescription: 'm1' },
        resource: {},
      },
      {
        id: 1145,
        title: { title: 't2' },
        metaDescription: { metaDescription: 'm2' },
        resource: {
          path: '/subject:4/topic:1:172816/topic:1:178048/resource:1:74420',
          resourceTypes: [
            { id: 'urn:resourcetype:academicArticle', name: 'Fagartikkel' },
            { id: 'urn:resourcetype:subjectMaterial', name: 'Fagstoff' },
          ],
        },
      },
    ],
  };

  expect(relatedContentPlugin.embedToHTML(embed)).toMatchSnapshot();
});
