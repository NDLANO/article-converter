/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { replaceEmbedsInHtml } from '../replacer';

it('replace various emdeds in html', async () => {
  const articleContent = `
    <section>
      <embed data-resource="image" data-id="6" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte"/>
      <p>SomeText1</p>
      <embed data-resource="h5p" data-id="8" data-url="http://ndla.no/h5p/embed/163489"/>
    </section>
    <section>
      <p>SomeText2</p>
    </section>
    <section>
      <embed data-resource="brightcove" data-id="2" data-videoid="ref:46012" data-account="4806596774001" data-player="BkLm8fT"/>
      <p>SomeText3</p>
      <embed data-resource="content-link" data-id="1" data-content-id="425" data-link-text="Valg av informanter"/>
    </section>
  `.replace(/\n|\r/g, ''); // Strip new lines

  const embeds = [
    { id: 1, resource: 'content-link', contentId: '425', linkText: 'Valg av informanter' },
    { id: 8, resource: 'h5p', url: 'http://ndla.no/h5p/embed/163489' },
    { id: 6,
      resource: 'image',
      metaUrl: 'http://api.test.ndla.no/images/1326',
      image: {
        id: '1326',
        metaUrl: 'http://api.test.ndla.no/images/1326',
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        images: { full: { url: 'http://api.test.ndla.no/images/full/421694461_818fee672d_o.jpg' } } },
    },
    { id: 2, resource: 'brightcove', account: 4806596774001, player: 'BkLm8fT', videoid: 'ref:46012' }];

  const replaced = await replaceEmbedsInHtml(embeds, articleContent, 'nb', []);

  expect(
    replaced.indexOf('<figure class="article_figure"><img class="article_image" alt="alt" src="http://api.test.ndla.no/images/full/421694461_818fee672d_o.jpg"/></figure>') !== -1
  ).toBeTruthy();

  expect(
    replaced.indexOf('<figure><iframe src="http://ndla.no/h5p/embed/163489"></iframe></figure>') !== -1
  ).toBeTruthy();

  expect(
    replaced.indexOf('<a href="http://api.test.ndla.no:8082/nb/article/425">Valg av informanter</a>') !== -1
  ).toBeTruthy();
  expect(
  replaced.indexOf('<figure><div style="display:block;position:relative;max-width:100%;"><div style="padding-top:56.25%;"><video style="width:100%;height:100%;position:absolute;top:0px;bottom:0px;right:0px;left:0px;" data-video-id="ref:46012" data-account="4806596774001" data-player="BkLm8fT" data-embed="default" class="video-js" controls=""></video></div></div></figure>') !== -1).toBeTruthy(); // eslint-disable-line max-len

  expect(replaced.indexOf('<p>SomeText1</p>') !== -1).toBeTruthy();
});


it('replace image embeds', async () => {
  const articleContent = `
    <section>
      <embed data-resource="image" data-id="1" data-align="left" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte"/>
      <embed data-resource="image" data-id="2" data-align="" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte"/>
    </section>
  `.replace(/\n|\r/g, ''); // Strip new lines

  const embeds = [
    { id: 1,
      resource: 'image',
      align: '',
      image: {
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        images: { full: { url: 'http://ndla.no/images/1.jpg' } } },
    },
    { id: 2,
      resource: 'image',
      align: 'left',
      image: {
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        images: { full: { url: 'http://ndla.no/images/2.jpg' } } },
    },
  ];

  const replaced = await replaceEmbedsInHtml(embeds, articleContent, 'nb', []);

  expect(
    replaced.indexOf('<figure class="article_figure"><img class="article_image" alt="alt" src="http://ndla.no/images/1.jpg"/></figure>') !== -1
  ).toBeTruthy();

  expect(
    replaced.indexOf('<figure class="article_figure article_figure--float-left"><img class="article_image" alt="alt" src="http://ndla.no/images/2.jpg"/></figure>') !== -1
  ).toBeTruthy();
});

it('replace nrk embeds', async () => {
  const articleContent = `
    <section>
      <embed data-id="1" data-nrk-video-id="94605" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18745" />
      <embed data-id="2" data-nrk-video-id="94606" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18746" />
    </section>
  `.replace(/\n|\r/g, ''); // Strip new lines

  const embeds = [
    { id: 1, resource: 'nrk', nrkVideoId: '123' },
    { id: 2, resource: 'nrk', nrkVideoId: '124' },
  ];

  const replaced = await replaceEmbedsInHtml(embeds, articleContent, 'nb', []);

  expect(replaced.indexOf('<div class="nrk-video" data-nrk-id="123"></div>') !== -1).toBeTruthy();
  expect(replaced.indexOf('<div class="nrk-video" data-nrk-id="124"></div>') !== -1).toBeTruthy();
});

it('replace audio embeds', async () => {
  const articleContent = '<section><embed data-id="1"/></section>'.replace(/\n|\r/g, ''); // Strip new lines

  const embeds = [
    { id: 1,
      resource: 'audio',
      audio: {
        titles: [
          { title: 'Tittel', language: 'nb' },
          { title: 'Title', language: 'en' },
        ],
        audioFiles: [
          {
            url: 'http://audio.no/file/voof.mp3',
            mimeType: 'audio/mpeg',
            language: '',
          },
        ],
      },
    },
  ];

  const replaced = await replaceEmbedsInHtml(embeds, articleContent, 'nb', []);

  expect(replaced.indexOf(
    '<figure class="article_audio"><audio controls type="audio/mpeg" src="http://audio.no/file/voof.mp3"></audio><figcaption>Tittel</figcaption></figure>'
  ) !== -1).toBeTruthy();
});
