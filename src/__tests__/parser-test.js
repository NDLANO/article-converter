/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import { articleWithMultipleResources, articleWithContentLink } from './_articleHtmlTestData';
import { getFiguresFromHtml } from '../parser';


test('parser getFiguresFromHtml (with content-link figures)', async (t) => {
  const figures = await getFiguresFromHtml(articleWithContentLink);
  t.is(figures.length, 2);
  t.deepEqual(figures, [
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

test('parser getFiguresFromHtml (qith multiple resources)', async (t) => {
  const figures = await getFiguresFromHtml(articleWithMultipleResources);
  t.is(figures.length, 5);
  t.deepEqual(figures, [
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
    }]);
});
