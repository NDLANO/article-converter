/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { prettify } from './testHelpers';
import { replaceEmbedsInHtml } from '../replacer';
import getEmbedMetaData from '../getEmbedMetaData';
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
  createKahootPlugin,
  createFootnotePlugin,
} from '../plugins';

test('replacer/replaceEmbedsInHtml replace various emdeds in html', async () => {
  const articleContent = cheerio.load(
    `<section>
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
    </section>`
  );

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
        title: {
          title: 'image title',
        },
        metaUrl: 'http://api.test.ndla.no/images/1326',
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
        imageUrl: 'http://api.test.ndla.no/images/1.jpg',
        copyright: {
          creators: [],
          rightsholders: [],
          processors: [],
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
        name: 'brightcove video',
        copyright: {
          authors: [],
          license: {
            license: 'by-nc',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace image embeds', async () => {
  const articleContent = cheerio.load(
    `<section>
      <embed data-resource="image" data-id="1" data-align="left" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte">
      <embed data-resource="image" data-id="2" data-align="" data-url="http://api.test.ndla.no/images/1326" data-size="hovedspalte">
    </section>`
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="image"]').first(),
      data: articleContent('embed[data-resource="image"]')
        .first()
        .data(),
      plugin: createImagePlugin(),
      resource: 'image',
      align: '',
      image: {
        id: 1,
        title: {
          title: 'image title 1',
        },
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
        imageUrl: 'http://ndla.no/images/1.jpg',
        copyright: {
          creators: [
            {
              type: 'Writer',
              name: 'Ola Foton',
            },
            {
              type: 'Artist',
              name: 'Kari Maler',
            },
          ],
          rightsholders: [
            {
              type: 'Supplier',
              name: 'Scanpix',
            },
          ],
          processors: [],

          license: {
            license: 'by-nc',
          },
        },
      },
    },
    {
      embed: articleContent('embed[data-resource="image"]').last(),
      data: articleContent('embed[data-resource="image"]')
        .last()
        .data(),
      plugin: createImagePlugin(),
      resource: 'image',
      align: 'left',
      image: {
        id: 2,
        title: {
          title: 'image title 2',
        },
        alttext: { alttext: 'alt' },
        caption: { caption: '' },
        imageUrl: 'http://ndla.no/images/2.jpg',
        copyright: {
          creators: [],
          rightsholders: [],
          processors: [],
          license: {
            license: 'by-nc',
          },
        },
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace brightcove embeds', async () => {
  const articleContent = cheerio.load(
    `<section>
      <embed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:1" data-caption="Brightcove caption" data-id="1" >
      <embed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:2" data-caption="Another caption" data-id="2" >
    </section>`
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="brightcove"]').first(),
      data: articleContent('embed[data-resource="brightcove"]')
        .first()
        .data(),
      plugin: createBrightcovePlugin(),
      brightcove: {
        copyright: {
          authors: [],
          license: {
            license: 'by-sa',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
    {
      embed: articleContent('embed[data-resource="brightcove"]').last(),
      data: articleContent('embed[data-resource="brightcove"]')
        .last()
        .data(),
      plugin: createBrightcovePlugin(),
      brightcove: {
        copyright: {
          authors: [],
          license: {
            license: 'by-sa',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace nrk embeds', async () => {
  const articleContent = cheerio.load(
    `<section>
      <embed data-id="1" data-nrk-video-id="94605" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18745" />
      <embed data-id="2" data-nrk-video-id="94606" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18746" />
    </section>`
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="nrk"]').first(),
      data: articleContent('embed[data-resource="nrk"]')
        .first()
        .data(),
      plugin: createNRKPlugin(),
    },
    {
      embed: articleContent('embed[data-resource="nrk"]').last(),
      data: articleContent('embed[data-resource="nrk"]')
        .last()
        .data(),
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
    '<section><embed data-resource="audio" data-id="1"/></section>'
  ); // Strip new lines
  const embeds = [
    {
      embed: articleContent('embed[data-resource="audio"]'),
      data: articleContent('embed[data-resource="audio"]').data(),
      plugin: createAudioPlugin(),
      audio: {
        title: { title: 'Tittel', language: 'Unknown' },
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
          mimeType: 'audio/mpeg',
        },
      },
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace prezi embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="prezi" data-url="http://prezi.com" data-width="1" data-height="2"/></section>'
  );
  const embeds = [
    {
      embed: articleContent('embed[data-resource="prezi"]'),
      data: articleContent('embed[data-resource="prezi"]').data(),
      plugin: createPreziPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace commoncraft embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="commoncraft" data-url="http://common.craft" data-width="1" data-height="2"/></section>'
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="commoncraft"]'),
      data: articleContent('embed[data-resource="commoncraft"]').data(),
      plugin: createCommoncraftPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace ndla-filmiundervisning embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="ndla-filmiundervisning" data-url="http://ndla.filmiundervisning.no/" data-width="1" data-height="2"/></section>'
  );

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
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace kahoot embeds', async () => {
  const articleContent = cheerio.load(
    '<section><embed data-resource="kahoot" data-url="https://embed.kahoot.it/e577f7e9-59ff-4a80-89a1-c95acf04815d" data-width="1" data-height="2"/></section>'
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="kahoot"]'),
      data: articleContent('embed[data-resource="kahoot"]').data(),
      plugin: createKahootPlugin(),
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace footnote embeds', async () => {
  const plugin = createFootnotePlugin();
  const articleContent = cheerio.load(
    '<section>' +
      '<embed data-authors="regjeringen.no" data-edition="" data-publisher="Barne-, likestillings- og inkluderingsdepartmentet" data-resource="footnote" data-title="Likestilling kommer ikke av seg selv" data-type="Report" data-year="2013">' +
      '<embed data-authors="Me;You" data-edition="2" data-publisher="test" data-resource="footnote" data-title="test" data-type="Book" data-year="2022">' +
      '</section>'
  );

  const embeds = [
    {
      embed: articleContent('embed[data-resource="footnote"]').first(),
      data: articleContent('embed[data-resource="footnote"]')
        .first()
        .data(),
      plugin,
    },
    {
      embed: articleContent('embed[data-resource="footnote"]').last(),
      data: articleContent('embed[data-resource="footnote"]')
        .last()
        .data(),
      plugin,
    },
  ];

  replaceEmbedsInHtml(embeds, 'nb');
  const replaced = articleContent('body').html();

  expect(getEmbedMetaData(embeds)).toMatchSnapshot();
  expect(prettify(replaced)).toMatchSnapshot();
});
