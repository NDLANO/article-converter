/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as articles from './_articleHtmlTestData';
import { getEmbedsFromHtml } from '../parser';

it('parser getEmbedsFromHtml (with audio embeds)', async () => {
  const embeds = await getEmbedsFromHtml(articles.articleWithAudioEmbed);
  expect(embeds.length).toBe(2);
  expect(embeds).toEqual([
    {
      id: 1,
      resource: 'audio',
      url: 'http://api.test.ndla.no/audio/1',
    },
    {
      id: 2,
      resource: 'audio',
      url: 'http://api.test.ndla.no/audio/2',
    }]);
});

it('parser getEmbedsFromHtml (with NRK embeds)', async () => {
  const embeds = await getEmbedsFromHtml(articles.articleWithNRKEmbed);
  expect(embeds.length).toBe(2);
  expect(embeds).toEqual([
    {
      id: 1,
      resource: 'nrk',
      nrkVideoId: '94605',
    },
    {
      id: 2,
      resource: 'nrk',
      nrkVideoId: '94606',
    }]);
});

it('parser getEmbedsFromHtml (with content-link embeds)', async () => {
  const embeds = await getEmbedsFromHtml(articles.articleWithContentLink);
  expect(embeds.length).toBe(2);
  expect(embeds).toEqual([
    {
      id: 1,
      resource: 'content-link',
      contentId: '425',
      linkText: 'Valg av informanter',
    },
    {
      id: 2,
      resource: 'content-link',
      contentId: '424',
      linkText: 'Bearbeiding av datamaterialet',
    }]);
});

it('parser getEmbedsFromHtml (qith multiple resources)', async () => {
  const embeds = await getEmbedsFromHtml(articles.articleWithMultipleResources);

  expect(embeds.length).toBe(6);
  expect(embeds).toEqual([
    {
      id: 8,
      resource: 'h5p',
      url: 'http://ndla.no/h5p/embed/163489',
    },
    {
      id: 7,
      resource: 'image',
      caption: 'Stillbilde fra filmen Viljens Triumf',
      size: 'hovedspalte',
      url: 'http://api.test.ndla.no/images/1327',
    },
    {
      id: 6,
      resource: 'image',
      caption: undefined,
      size: 'hovedspalte',
      url: 'http://api.test.ndla.no/images/1326',
    },
    {
      id: 4,
      resource: 'image',
      align: 'right',
      caption: undefined,
      size: 'hovedspalte',
      url: 'http://api.test.ndla.no/images/1325',
    },
    {
      id: 2,
      resource: 'brightcove',
      account: 4806596774001,
      player: 'BkLm8fT',
      videoid: 'ref:46012',
    },
    {
      id: 1,
      resource: 'external',
      url: 'https://youtu.be/BAb8NZ3e4e4',
    },
  ]);
});
