/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import articleHtml from './_articleHtmlTestData';
import { getFiguresFromHtml } from '../parser';

test('parser getFigures', async t => {
  const figures = await getFiguresFromHtml(articleHtml);
  t.is(figures.length, 5);
  t.deepEqual(figures, [{ id: 8,
    resource: 'h5p',
    figure: { url: 'http://ndla.no/h5p/embed/163489' } },
  { id: 7,
    resource: 'image',
    size: 'hovedspalte',
    url: 'http://api.test.ndla.no/images/1327' },
  { id: 6,
    resource: 'image',
    size: 'hovedspalte',
    url: 'http://api.test.ndla.no/images/1326' },
  { id: 4,
    resource: 'image',
    size: 'hovedspalte',
    url: 'http://api.test.ndla.no/images/1325' },
  { id: 2,
    resource: 'brightcove',
    figure:
     { account: 4806596774001,
       player: 'BkLm8fT',
       videoid: 'ref:46012' } }]);
  t.pass();
});
