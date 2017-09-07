/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import {
  replaceEmbedsInHtml,
  addClassToTag,
  replaceStartAndEndTag,
} from '../replacer';
import {
  createContentLinkPlugin,
  createH5pPlugin,
  createImagePlugin,
  createBrightcovePlugin,
  createNRKPlugin,
  createAudioPlugin,
  createPreziPlugin,
  createCommoncraftPlugin,
  createNdlaFilmIUndervisning,
} from '../plugins';

test('replacer/replaceEmbedsInHtml replace various emdeds in html', async () => {
  const articleContent = cheerio.load(
    `
    <section>
      <embed data-resource="image" data-id="6" data-url="https://api.test.ndla.no/images/1326" data-size="hovedspalte">
      <p>SomeText1</p>
      <embed data-resource="h5p" data-id="8" data-url="https://ndlah5p.joubel.com/node/4">
    </section>
    <section>
      <p>SomeText2</p>
    </section>
    <section>
      <embed data-resource="brightcove" data-id="2" data-videoid="ref:46012" data-account="4806596774001" data-player="BkLm8fT"/>
      <p>SomeText3</p>
      <embed data-resource="content-link" data-id="1" data-content-id="425" data-link-text="Valg av informanter"/>
    </section>
  `.replace(/\n|\r/g, '')
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="content-link"]'),
      data: articleContent('embed[data-resource="content-link"]').data(),
      plugin: createContentLinkPlugin(),
    },
    {
      embed: articleContent('embed[data-resource="h5p"]'),
      data: articleContent('embed[data-resource="h5p"]').data(),
      plugin: createH5pPlugin(),
      oembed: {
        html: '<iframe src="https://ndlah5p.joubel.com/h5p/embed/4"></iframe>',
      },
    },
    {
      embed: articleContent('embed[data-resource="image"]'),
      data: articleContent('embed[data-resource="image"]').data(),
      plugin: createImagePlugin(),
      image: {
        id: '1326',
        metaUrl: 'http://api.test.ndla.no/images/1326',
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
        imageUrl: 'http://api.test.ndla.no/images/1.jpg',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
    {
      embed: articleContent('embed[data-resource="brightcove"]'),
      data: articleContent('embed[data-resource="brightcove"]').data(),
      plugin: createBrightcovePlugin(),
      brightcove: {
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(/<figure class="c-figure".*?>.*?<\/figure>/);
  expect(replaced).toMatch(
    /<img alt="alt" src="http:\/\/api.test.ndla.no\/images\/1.jpg\?width=1024".*?\/>/
  );

  expect(replaced).toMatch(
    '<figure><iframe src="https://ndlah5p.joubel.com/h5p/embed/4"></iframe></figure>'
  );

  expect(replaced).toMatch(
    '<a href="https://ndla-frontend.test.api.ndla.no/nb/article/425">Valg av informanter</a>'
  );
  expect(replaced).toMatch('<video');
  expect(replaced).toMatch(
    'data-video-id="ref:46012" data-account="4806596774001" data-player="BkLm8fT" data-embed="default" class="video-js" controls>'
  );
  expect(replaced).toMatch('</video>');
  expect(replaced).toMatch('<p>SomeText1</p>');
});

test('replacer/replaceEmbedsInHtml replace image embeds', async () => {
  const articleContent = cheerio.load(
    `
    <section>
      <embed data-resource="image" data-id="1" data-align="left" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte">
      <embed data-resource="image" data-id="2" data-align="" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte">
    </section>
  `.replace(/\n|\r/g, '')
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="image"]').first(),
      data: articleContent('embed[data-resource="image"]').first().data(),
      plugin: createImagePlugin(),
      id: 1,
      resource: 'image',
      align: '',
      image: {
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
        imageUrl: 'http://ndla.no/images/1.jpg',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
    {
      embed: articleContent('embed[data-resource="image"]').last(),
      data: articleContent('embed[data-resource="image"]').last().data(),
      plugin: createImagePlugin(),
      id: 2,
      resource: 'image',
      align: 'left',
      image: {
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
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

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(/<figure class="c-figure".*?>.*?<\/figure>/);
  expect(replaced).toMatch(
    /<img alt="alt" src="http:\/\/ndla.no\/images\/1.jpg\?width=1024".*?\/>/
  );

  expect(replaced).toMatch(
    /<figure class="c-figure article_figure--float-left">.*?<\/figure>/
  );
  expect(replaced).toMatch(
    /<img alt="alt" src="http:\/\/ndla.no\/images\/2.jpg\?width=1024".*?\/>/
  );
});

test('replacer/replaceEmbedsInHtml replace brightcove embeds', async () => {
  const articleContent = cheerio.load(
    `
    <section>
      <embed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:1" data-caption="Brightcove caption" data-id="1" >
      <embed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:2" data-caption="Another caption" data-id="2" >
    </section>
  `.replace(/\n|\r/g, '')
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="brightcove"]').first(),
      data: articleContent('embed[data-resource="brightcove"]').first().data(),
      plugin: createBrightcovePlugin(),
      brightcove: {
        copyright: {
          authors: [],
          license: {
            license: 'by-sa',
          },
        },
      },
    },
    {
      embed: articleContent('embed[data-resource="brightcove"]').last(),
      data: articleContent('embed[data-resource="brightcove"]').last().data(),
      plugin: createBrightcovePlugin(),
      brightcove: {
        copyright: {
          authors: [],
          license: {
            license: 'by-sa',
          },
        },
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(
    /data-video-id="ref:1" data-account="1337" data-player="BkLm8fT" data-embed="default" class="video-js" controls>/
  );
  expect(replaced).toMatch(
    /data-video-id="ref:2" data-account="1337" data-player="BkLm8fT" data-embed="default" class="video-js" controls>/
  );
  expect(replaced).toMatch(
    /<figure.*>.*<figcaption.*?>.*Brightcove caption.*<\/figcaption>.*<\/figure>/
  );
  expect(replaced).toMatch(
    /<figure.*>.*<figcaption.*?>.*Another caption.*<\/figcaption>.*<\/figure>/
  );
  expect(replaced).toMatch(/<button.*>Kopier referanse<\/button>/);
});

test('replacer/replaceEmbedsInHtml replace nrk embeds', async () => {
  const articleContent = cheerio.load(
    `
    <section>
      <embed data-id="1" data-nrk-video-id="94605" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18745" />
      <embed data-id="2" data-nrk-video-id="94606" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18746" />
    </section>
  `.replace(/\n|\r/g, '')
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="nrk"]').first(),
      data: articleContent('embed[data-resource="nrk"]').first().data(),
      plugin: createNRKPlugin(),
    },
    {
      embed: articleContent('embed[data-resource="nrk"]').last(),
      data: articleContent('embed[data-resource="nrk"]').last().data(),
      plugin: createNRKPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="94605"></div>');
  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="94606"></div>');
});

test('replacer/replaceEmbedsInHtml replace audio embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="audio" data-id="1"/></section>'.replace(
      /\n|\r/g,
      ''
    )
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="audio"]'),
      data: articleContent('embed[data-resource="audio"]').data(),
      plugin: createAudioPlugin(),
      audio: {
        title: 'Tittel',
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
          mimeType: 'audio/mpeg',
        },
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(
    '<figure class="article_audio"><audio controls type="audio/mpeg" src="http://audio.no/file/voof.mp3"></audio><figcaption>Tittel</figcaption></figure>'
  );
});

test('replacer/replaceEmbedsInHtml replace prezi embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="prezi" data-url="http://prezi.com" data-width="1" data-height="2"/></section>'.replace(
      /\n|\r/g,
      ''
    )
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="prezi"]'),
      data: articleContent('embed[data-resource="prezi"]').data(),
      plugin: createPreziPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(
    '<iframe id="iframe_container" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen width="1" height="2" src="http://prezi.com"></iframe>'
  );
});

test('replacer/replaceEmbedsInHtml replace commoncraft embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="commoncraft" data-url="http://common.craft" data-width="1" data-height="2"/></section>'.replace(
      /\n|\r/g,
      ''
    )
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="commoncraft"]'),
      data: articleContent('embed[data-resource="commoncraft"]').data(),
      plugin: createCommoncraftPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(
    '<iframe id="cc-embed" src="http://common.craft" width="1" height="2" frameborder="0" scrolling="false"></iframe>'
  );
});

test('replacer/replaceEmbedsInHtml replace ndla-filmiundervisning embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="ndla-filmiundervisning" data-url="http://ndla.filmiundervisning.no/" data-width="1" data-height="2"/></section>'.replace(
      /\n|\r/g,
      ''
    )
  ); // Strip new lines

  const embeds = [
    {
      embed: articleContent('embed[data-resource="ndla-filmiundervisning"]'),
      data: articleContent(
        'embed[data-resource="ndla-filmiundervisning"]'
      ).data(),
      plugin: createNdlaFilmIUndervisning(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent.html();

  expect(replaced).toMatch(
    '<iframe src="http://ndla.filmiundervisning.no/" style="border: none;" frameborder="0" width="1" height="2" allowfullscreen></iframe>'
  );
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

  expect(result).toMatch(
    '<aside class="u-1/3@desktop"><h2>Test1</h2><div>Stuff</div></aside>'
  );
  expect(result).toMatch(
    '<aside class="u-1/3@desktop"><h3 class="headline-level-3">Test2</h3><div>Other stuff</div></aside>'
  );
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

  expect(result).toMatch('<section><h2>Test1</h2><div>Stuff</div></section>');
  expect(result).toMatch('<aside><div>Lorem ipsum</div></aside>');
});
