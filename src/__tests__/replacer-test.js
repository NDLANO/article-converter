/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { replaceEmbedsInHtml, addClassToTag, replaceStartAndEndTag } from '../replacer';

test('replacer/replaceEmbedsInHtml replace various emdeds in html', async () => {
  const articleContent = `
    <section>
      <embed data-resource="image" data-id="6" data-url="https://api.test.ndla.no/images/1326" data-size="hovedspalte"/>
      <p>SomeText1</p>
      <embed data-resource="h5p" data-id="8" data-url="https://ndlah5p.joubel.com/node/4"/>
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
    { id: 8, resource: 'h5p', url: 'https://ndlah5p.joubel.com/h5p/embed/4', oembed: { html: '<iframe src="https://ndlah5p.joubel.com/h5p/embed/4"></iframe>' } },
    { id: 6,
      resource: 'image',
      metaUrl: 'http://api.test.ndla.no/images/1326',
      image: {
        id: '1326',
        metaUrl: 'http://api.test.ndla.no/images/1326',
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        imageUrl: 'http://api.test.ndla.no/images/1.jpg',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
    { id: 2, resource: 'brightcove', account: 4806596774001, player: 'BkLm8fT', videoid: 'ref:46012' }];

  const replaced = await replaceEmbedsInHtml(embeds, 'nb')(articleContent);

  expect(replaced).toMatch(/<figure class="c-figure".*?>.*?<\/figure>/);
  expect(replaced).toMatch(/<img alt="alt" src="http:\/\/api.test.ndla.no\/images\/1.jpg".*?\/>/);

  expect(replaced).toMatch('<figure><iframe src="https://ndlah5p.joubel.com/h5p/embed/4"></iframe></figure>');

  expect(replaced).toMatch('<a href="https://ndla-frontend.test.api.ndla.no/nb/article/425">Valg av informanter</a>');
  expect(replaced).toMatch('<video');
  expect(replaced).toMatch('data-video-id="ref:46012" data-account="4806596774001" data-player="BkLm8fT" data-embed="default" class="video-js" controls="">');
  expect(replaced).toMatch('</video>');
  expect(replaced).toMatch('<p>SomeText1</p>');
});


test('replacer/replaceEmbedsInHtml replace image embeds', async () => {
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
        imageUrl: 'http://ndla.no/images/1.jpg',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
    { id: 2,
      resource: 'image',
      align: 'left',
      image: {
        alttexts: [{ alttext: 'alt', lang: 'nb' }],
        imageUrl: 'http://ndla.no/images/2.jpg',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
  ];

  const replaced = await replaceEmbedsInHtml(embeds, 'nb')(articleContent);

  expect(replaced).toMatch(/<figure class="c-figure".*?>.*?<\/figure>/);
  expect(replaced).toMatch(/<img alt="alt" src="http:\/\/ndla.no\/images\/1.jpg".*?\/>/);

  expect(replaced).toMatch('<figure class="article_figure article_figure--float-left"><img class="article_image" alt="alt" src="http://ndla.no/images/2.jpg"/></figure>');
});

test('replacer/replaceEmbedsInHtml replace brightcove embeds', async () => {
  const articleContent = `
    <section>
      <embed data-id="1" />
      <embed data-id="2" />
    </section>
  `.replace(/\n|\r/g, ''); // Strip new lines

  const embeds = [
    { id: 1, resource: 'brightcove', account: 1337, player: 'BkLm8fT', caption: 'Brightcove caption', videoid: 'ref:1' },
    { id: 2, resource: 'brightcove', account: 1337, player: 'BkLm8fT', caption: '', videoid: 'ref:2' },
  ];

  const replaced = await replaceEmbedsInHtml(embeds, 'nb')(articleContent);

  expect(replaced).toMatch(/data-video-id="ref:1" data-account="1337" data-player="BkLm8fT" data-embed="default" class="video-js" controls="">/);
  expect(replaced).toMatch(/data-video-id="ref:2" data-account="1337" data-player="BkLm8fT" data-embed="default" class="video-js" controls="">/);
  expect(replaced).toMatch(/<figurecaption.*?>Brightcove caption<\/figurecaption>/);
  expect(replaced).not.toMatch(/<figurecaption.*?><\/figurecaption>/);
});

test('replacer/replaceEmbedsInHtml replace nrk embeds', async () => {
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

  const replaced = await replaceEmbedsInHtml(embeds, 'nb')(articleContent);

  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="123"></div>');
  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="124"></div>');
});

test('replacer/replaceEmbedsInHtml replace audio embeds', async () => {
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

  const replaced = await replaceEmbedsInHtml(embeds, 'nb')(articleContent);

  expect(replaced)
    .toMatch('<figure class="article_audio"><audio controls type="audio/mpeg" src="http://audio.no/file/voof.mp3"></audio><figcaption>Tittel</figcaption></figure>');
});

test('replacer/addClassToTag can add class to tag', () => {
  const content = `
  <section>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <aside><h3>Test2</h3><div>Other stuff</div></aside>
  </section>`;

  const fn1 = addClassToTag('aside', 'u-1/3@desktop');
  const fn2 = addClassToTag('h3', 'headline-level-3');
  const result = [fn1, fn2].reduce((html, f) => f(html), content);


  expect(result)
    .toMatch('<aside class="u-1/3@desktop"><h2>Test1</h2><div>Stuff</div></aside>');
  expect(result)
    .toMatch('<aside class="u-1/3@desktop"><h3 class="headline-level-3">Test2</h3><div>Other stuff</div></aside>');
});

test('replacer/replaceStartAndEndTag can relace start and end tag with new tag/html', () => {
  const content = `
  <section>
    <aside><h2>Test1</h2><div>Stuff</div></aside>
    <p>Lorem ipsum</p>
  </section>`;

  const fn1 = replaceStartAndEndTag('aside', '<section>', '</section>');
  const fn2 = replaceStartAndEndTag('p', '<aside><div>', '</div></aside>');
  const result = [fn1, fn2].reduce((html, f) => f(html), content);


  expect(result)
    .toMatch('<section><h2>Test1</h2><div>Stuff</div></section>');
  expect(result)
    .toMatch('<aside><div>Lorem ipsum</div></aside>');
});
