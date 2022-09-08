/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import bunyan from 'bunyan';
import getLogger from '../../utils/logger';
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
    paths: [
      '/subject:12/topic:1:183846/topic:1:183935/resource:1:110269',
      '/subject:1/topic:1:183846/topic:1:183935/resource:1:110269',
    ],
  },
];

test('fetchResource when no article ids is provided', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();
  const resource = await relatedContentPlugin.fetchResource({ data: {} });
  expect(resource).toEqual({ data: {} });
});

test('fetchResource for two related articles', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  ['1', '2'].forEach((id) => {
    nock('http://ndla-api')
      .get(`/article-api/v2/articles/${id}?language=nb&fallback=true`)
      .reply(200, {
        title: { title: `title${id}` },
        introduction: { introduction: `introduction${id}` },
      });
    nock('http://ndla-api')
      .get(`/taxonomy/v1/resources?contentURI=urn:article:${id}&language=nb`)
      .reply(200, articleResource);
  });

  const resource1 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '1' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource1).toMatchSnapshot();

  const resource2 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '2' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource2).toMatchSnapshot();
});

test('fetchResource for different taxonomy version', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  nock('http://ndla-api')
    .get(`/article-api/v2/articles/1?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `title1` },
      introduction: { introduction: `introduction1}` },
    });
  nock('http://ndla-api', {
    reqheaders: {
      versionhash: 'ndla',
    },
  })
    .get(`/taxonomy/v1/resources?contentURI=urn:article:1&language=nb`)
    .reply(200, articleResource);

  const resource1 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '1' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
      versionHash: 'ndla',
    },
  );
  expect(resource1).toMatchSnapshot();
});

test('fetchResource for an external article', async () => {
  const log = getLogger();
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const relatedContentPlugin = createRelatedContentPlugin();

  const externalResource = await relatedContentPlugin.fetchResource(
    {
      data: {
        title: 'Helsedirektoratet om reklame for alkohol',
        url: 'https://helsedirektoratet.no/folkehelse/alkohol/forbud-mot-alkoholreklame',
      },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(externalResource).toMatchSnapshot();

  log.level(bunyan.INFO);
});

test('fetchResource for two related articles, where one could not be fetched from article-api', async () => {
  const log = getLogger();
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const relatedContentPlugin = createRelatedContentPlugin();
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/1?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `title1` },
      introduction: { introduction: `introduction1` },
    });

  nock('http://ndla-api')
    .get(`/taxonomy/v1/resources?contentURI=urn:article:1&language=nb`)
    .reply(200, articleResource);

  nock('http://ndla-api')
    .get(`/article-api/v2/articles/2?language=nb&fallback=true`)
    .reply(501, {});

  const resource1 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '1' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource1).toMatchSnapshot();

  const resource2 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '2' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource2).toMatchSnapshot();

  log.level(bunyan.INFO);
});

test('fetchResource for two related articles, where one could not be fetched from taxonomy-api', async () => {
  const log = getLogger();
  log.level(bunyan.FATAL + 1); // temporarily disable logging

  const relatedContentPlugin = createRelatedContentPlugin();
  nock('http://ndla-api')
    .get(`/article-api/v2/articles/1?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `title1` },
      introduction: { introduction: `introduction1` },
    });
  nock('http://ndla-api')
    .get(`/taxonomy/v1/resources?contentURI=urn:article:1&language=nb`)
    .reply(200, articleResource);

  nock('http://ndla-api')
    .get(`/article-api/v2/articles/2?language=nb&fallback=true`)
    .reply(200, {
      title: { title: `title2` },
      introduction: { introduction: `introduction2` },
    });
  nock('http://ndla-api')
    .get(`/taxonomy/v1/resources?contentURI=urn:article:2&language=nb`)
    .reply(500, {});

  const resource1 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '1' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource1).toMatchSnapshot();

  const resource2 = await relatedContentPlugin.fetchResource(
    {
      data: { articleId: '2' },
    },
    {
      lang: 'nb',
      accessToken: 'some_token',
      feideToken: 'some_other_token',
    },
  );
  expect(resource2).toMatchSnapshot();

  log.level(bunyan.INFO);
});

test('embedToHtml should return empty string if no related articles is provided', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  expect(await relatedContentPlugin.embedToHTML({ data: { resource: 'related-content' } })).toEqual(
    {
      html: '',
    },
  );
  expect(
    await relatedContentPlugin.embedToHTML({
      data: { resource: 'related-content' },
    }),
  ).toEqual({ html: '' });
});

test('embedToHtml should return fallback url if no resource was found', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  const embed1 = {
    data: { articleId: '1231', resource: 'related-content' },
    article: {
      id: 1231,
      title: { title: 't1' },
      metaDescription: { metaDescription: 'm1' },
    },
  };
  expect((await relatedContentPlugin.embedToHTML(embed1)).html).toMatchSnapshot();

  const embed2 = {
    data: { articleId: '1145', resource: 'related-content' },
    article: {
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
  };
  expect((await relatedContentPlugin.embedToHTML(embed2)).html).toMatchSnapshot();
});

test('embedToHtml should return an external article if url is set', async () => {
  const relatedContentPlugin = createRelatedContentPlugin();

  const embed = {
    data: {
      resource: 'related-content',
      title: 'Om lov om forbud mot diskriminering',
      url: 'https://www.regjeringen.no/no/dokumenter/otprp-nr-44-2007-2008-/id505404/',
    },
  };

  expect((await relatedContentPlugin.embedToHTML(embed)).html).toMatchSnapshot();
});

test('embedToHtml should return absolute url if provided in options', async () => {
  const relatedContentPlugin = createRelatedContentPlugin({ absoluteUrl: true });

  const embed1 = {
    data: { articleId: '1231', resource: 'related-content' },
    article: {
      id: 1231,
      title: { title: 't1' },
      metaDescription: { metaDescription: 'm1' },
    },
  };
  expect((await relatedContentPlugin.embedToHTML(embed1)).html).toMatchSnapshot();

  const embed2 = {
    data: { articleId: '1145', resource: 'related-content' },
    article: {
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
  };
  expect((await relatedContentPlugin.embedToHTML(embed2)).html).toMatchSnapshot();
});
