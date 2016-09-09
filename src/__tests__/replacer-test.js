/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import { replaceFiguresInHtml } from '../replacer';

test('replacer replaceFiguresInHtml', async t => {
  const articleContent = `
    <article>
      <figure data-resource="image" data-id="6" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte"></figure>
      <figure data-resource="h5p" data-id="8" data-url="http://ndla.no/h5p/embed/163489"></figure>
      <p>SomeText</p>
      <figure data-resource="brightcove" data-id="2" data-videoid="ref:46012" data-account="4806596774001" data-player="BkLm8fT"></figure>
    </article>
  `;

  const figures = [
    { id: 8, resource: 'h5p', figure: { url: 'http://ndla.no/h5p/embed/163489' } },
    { id: 6,
      resource: 'image',
      metaUrl: 'http://api.test.ndla.no/images/1326',
      figure: {
        id: '1326',
        metaUrl: 'http://api.test.ndla.no/images/1326',
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        images: { full: { url: 'http://api.test.ndla.no/images/full/421694461_818fee672d_o.jpg' } } },
    },
    { id: 2, resource: 'brightcove', figure: { account: 4806596774001, player: 'BkLm8fT', videoid: 'ref:46012' } }];

  const replaced = await replaceFiguresInHtml(figures, articleContent, 'nb');

  t.truthy(replaced.indexOf('<figure><img alt="presentation" src="http://api.test.ndla.no/images/full/421694461_818fee672d_o.jpg"/><span class="figure_caption">alt</span></figure>') !== -1);
  t.truthy(replaced.indexOf('<figure><iframe style="width:100%;height:100%;position:absolute;top:0px;bottom:0px;right:0px;left:0px;" src="http://ndla.no/h5p/embed/163489"></iframe></figure>') !== -1);
  t.truthy(replaced.indexOf('<iframe style="width:100%;height:100%;position:absolute;top:0px;bottom:0px;right:0px;left:0px;" src="//players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=ref:46012" allowfullscreen=""></iframe>') !== -1); // eslint-disable-line max-len
});
