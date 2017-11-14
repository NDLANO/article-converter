/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import * as articles from './_articleHtmlTestData';
import { getEmbedsFromHtml } from '../parser';

const getEmbedDetails = embeds =>
  embeds.map(({ data, plugin }) => ({
    data,
    plugin: plugin.resource,
  }));

it('parser getEmbedsFromHtml (with audio embeds)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithAudioEmbed)
  );
  expect(embeds.length).toBe(2);

  const embedDetails = getEmbedDetails(embeds);
  expect(embedDetails).toEqual([
    {
      plugin: 'audio',
      data: {
        id: 1,
        resource: 'audio',
        url: 'http://api.test.ndla.no/audio/1',
      },
    },
    {
      plugin: 'audio',
      data: {
        id: 2,
        resource: 'audio',
        url: 'http://api.test.ndla.no/audio/2',
      },
    },
  ]);
});

it('parser getEmbedsFromHtml (with NRK embeds)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithNRKEmbed)
  );
  expect(embeds.length).toBe(2);

  const emebedDetails = getEmbedDetails(embeds);
  expect(emebedDetails).toEqual([
    {
      plugin: 'nrk',
      data: {
        id: 1,
        resource: 'nrk',
        nrkVideoId: 94605,
        url: 'http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18745',
      },
    },
    {
      plugin: 'nrk',
      data: {
        id: 2,
        resource: 'nrk',
        nrkVideoId: 94606,
        url: 'http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18746',
      },
    },
  ]);
});

it('parser getEmbedsFromHtml (with content-link embeds)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithContentLink)
  );
  expect(embeds.length).toBe(2);

  const embedDetails = getEmbedDetails(embeds);
  expect(embedDetails).toEqual([
    {
      plugin: 'content-link',
      data: {
        id: 1,
        resource: 'content-link',
        contentId: 425,
        linkText: 'Valg av informanter',
      },
    },
    {
      plugin: 'content-link',
      data: {
        id: 2,
        resource: 'content-link',
        contentId: 424,
        linkText: 'Bearbeiding av datamaterialet',
        openIn: 'new-context',
      },
    },
  ]);
});

it('parser getEmbedsFromHtml (with brightcove embeds)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithBrightcoveEmbed)
  );
  expect(embeds.length).toBe(2);

  const embedDetails = getEmbedDetails(embeds);
  expect(embedDetails).toEqual([
    {
      plugin: 'brightcove',
      data: {
        id: 1,
        resource: 'brightcove',
        account: 1337,
        player: 'BkLm8fT',
        caption: 'Brightcove caption',
        videoid: 'ref:1',
      },
    },
    {
      plugin: 'brightcove',
      data: {
        id: 2,
        resource: 'brightcove',
        account: 1337,
        player: 'BkLm8fT',
        caption: '',
        videoid: 'ref:2',
      },
    },
  ]);
});

it('parser getEmbedsFromHtml (with external embeds)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithExternalEmbed)
  );
  expect(embeds.length).toBe(2);

  const embedDetails = getEmbedDetails(embeds);
  expect(embedDetails).toEqual([
    {
      plugin: 'external',
      data: {
        id: 1,
        resource: 'external',
        url: 'https://youtu.be/BAb8NZ3e4e4',
      },
    },
    {
      plugin: 'external',
      data: {
        id: 2,
        resource: 'external',
        url: 'https://vimeo.com/BAb8NZ3e4e4',
      },
    },
  ]);
});

it('parser getEmbedsFromHtml (with multiple resources)', async () => {
  const embeds = await getEmbedsFromHtml(
    cheerio.load(articles.articleWithMultipleResources)
  );
  expect(embeds.length).toBe(6);

  const embedDetails = getEmbedDetails(embeds);
  expect(embedDetails).toEqual([
    {
      plugin: 'h5p',
      data: {
        id: 8,
        resource: 'h5p',
        url: 'http://ndla.no/h5p/embed/163489',
      },
    },
    {
      plugin: 'image',
      data: {
        id: 7,
        resource: 'image',
        caption: 'Stillbilde fra filmen Viljens Triumf',
        size: 'hovedspalte',
        url: 'http://api.test.ndla.no/images/1327',
      },
    },
    {
      plugin: 'image',
      data: {
        id: 6,
        resource: 'image',
        caption: '',
        size: 'hovedspalte',
        url: 'http://api.test.ndla.no/images/1326',
      },
    },
    {
      plugin: 'image',
      data: {
        id: 4,
        resource: 'image',
        align: 'right',
        caption: '',
        size: 'hovedspalte',
        url: 'http://api.test.ndla.no/images/1325',
      },
    },
    {
      plugin: 'brightcove',
      data: {
        id: 2,
        resource: 'brightcove',
        account: 4806596774001,
        player: 'BkLm8fT',
        caption: 'Brightcove caption',
        videoid: 'ref:46012',
      },
    },
    {
      plugin: 'external',
      data: {
        id: 1,
        resource: 'external',
        url: 'https://example.com/BAb8NZ3e4e4',
      },
    },
  ]);
});
