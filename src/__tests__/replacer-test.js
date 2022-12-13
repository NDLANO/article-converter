/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { prettify } from './testHelpers';
import { replaceEmbedsInHtml } from '../replacer';
import getEmbedMetaData from '../getEmbedMetaData';
import {
  createH5pPlugin,
  createImagePlugin,
  createBrightcovePlugin,
  createNRKPlugin,
  createAudioPlugin,
  createIframePlugin,
  createFootnotePlugin,
} from '../plugins';
import { parseHtml } from '../utils/htmlParser';

test('replacer/replaceEmbedsInHtml replace various emdeds in html', async () => {
  const articleContent = parseHtml(
    `<section>
      <ndlaembed data-resource="image" data-id="6" data-url="https://api.test.ndla.no/images/1326" data-size="hovedspalte"></ndlaembed>
      <p>SomeText1</p>
      <ndlaembed data-resource="h5p" data-id="8" data-url="https://ndlah5p.joubel.com/node/4"></ndlaembed>
    </section>
    <section>
      <p>SomeText2</p>
    </section>
    <section>
      <ndlaembed data-resource="brightcove" data-id="2" data-videoid="ref:46012" data-account="4806596774001" data-player="BkLm8fT"></ndlaembed>
      <p>SomeText3</p>
    </section>`,
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="h5p"]'),
      data: articleContent('ndlaembed[data-resource="h5p"]').data(),
      oembed: {
        html: '<iframe src="https://ndlah5p.joubel.com/h5p/embed/4"></iframe>',
      },
    },
    {
      embed: articleContent('ndlaembed[data-resource="image"]'),
      data: articleContent('ndlaembed[data-resource="image"]').data(),
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
            license: 'CC-BY-NC-4.0',
          },
        },
      },
    },
    {
      embed: articleContent('ndlaembed[data-resource="brightcove"]'),
      data: articleContent('ndlaembed[data-resource="brightcove"]').data(),
      brightcove: {
        name: 'brightcove video',
        id: '46012',
        copyright: {
          creators: [],
          rightsholders: [],
          processors: [],
          license: {
            license: 'CC-BY-NC-4.0',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
  ];

  const plugins = [createH5pPlugin(), createImagePlugin(), createBrightcovePlugin()];

  await replaceEmbedsInHtml(embeds, 'nb', plugins);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace image embeds', async () => {
  const articleContent = parseHtml(
    `<section>
      <ndlaembed data-resource="image" data-id="1" data-align="left" data-url="http://api.test.ndla.no/images/1326" data-size="full"></ndlaembed>
      <ndlaembed data-resource="image" data-id="2" data-align="" data-url="http://api.test.ndla.no/images/1326" data-size="full"></ndlaembed>
    </section>`,
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="image"]').first(),
      data: articleContent('ndlaembed[data-resource="image"]').first().data(),
      resource: 'image',
      align: '',
      image: {
        id: '1',
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
            license: 'CC-BY-NC-4.0',
          },
        },
      },
    },
    {
      embed: articleContent('ndlaembed[data-resource="image"]').last(),
      data: articleContent('ndlaembed[data-resource="image"]').last().data(),
      resource: 'image',
      align: 'left',
      image: {
        id: '2',
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
            license: 'CC-BY-NC-4.0',
          },
        },
      },
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createImagePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace brightcove embeds', async () => {
  const articleContent = parseHtml(
    `<section>
      <ndlaembed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:1" data-caption="Brightcove caption" data-id="1" ></ndlaembed>
      <ndlaembed data-resource="brightcove" data-account=1337 data-player="BkLm8fT" data-videoid="ref:2" data-caption="Another caption" data-id="2" ></ndlaembed>
    </section>`,
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="brightcove"]').first(),
      data: articleContent('ndlaembed[data-resource="brightcove"]').first().data(),
      brightcove: {
        id: '1',
        copyright: {
          creators: [],
          rightsholders: [],
          processors: [],
          license: {
            license: 'CC-BY-SA-4.0',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
    {
      embed: articleContent('ndlaembed[data-resource="brightcove"]').last(),
      data: articleContent('ndlaembed[data-resource="brightcove"]').last().data(),
      brightcove: {
        id: '2',
        copyright: {
          creators: [],
          rightsholders: [],
          processors: [],
          license: {
            license: 'CC-BY-SA-4.0',
          },
        },
        sources: [{ height: 768, width: 1024 }],
      },
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createBrightcovePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace nrk embeds', async () => {
  const articleContent = parseHtml(
    `<section>
      <ndlaembed data-id="1" data-nrk-video-id="94605" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18745"></ndlaembed>
      <ndlaembed data-id="2" data-nrk-video-id="94606" data-resource="nrk" data-url="http://nrk.no/skole/klippdetalj?topic=urn%3Ax-mediadb%3A18746"></ndlaembed>
    </section>`,
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="nrk"]').first(),
      data: articleContent('ndlaembed[data-resource="nrk"]').first().data(),
    },
    {
      embed: articleContent('ndlaembed[data-resource="nrk"]').last(),
      data: articleContent('ndlaembed[data-resource="nrk"]').last().data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createNRKPlugin()]);
  const replaced = articleContent.html();

  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="94605"></div>');
  expect(replaced).toMatch('<div class="nrk-video" data-nrk-id="94606"></div>');
});

test('replacer/replaceEmbedsInHtml replace audio embeds', async () => {
  const articleContent = parseHtml(
    `<section>
      <ndlaembed data-resource="audio" data-type="standard" data-caption="Caption 1" data-id="1"></ndlaembed>
      <ndlaembed data-resource="audio" data-type="minimal" data-caption="Caption 2" data-id="2"></ndlaembed>
    </section>`,
  ); // Strip new lines
  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="audio"]').first(),
      data: articleContent('ndlaembed[data-resource="audio"]').first().data(),
      audio: {
        id: 1,
        title: { title: 'Tittel', language: 'Unknown' },
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
          mimeType: 'audio/mpeg',
        },
        copyright: {
          license: {
            license: 'CC-BY-SA-4.0',
            description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
            url: 'https://creativecommons.org/licenses/by-sa/2.0/',
          },
          creators: [{ type: 'writer', name: 'name' }],
          rightsholders: [{ type: 'processor', name: 'name' }],
          processors: [{ type: 'publisher', name: 'name' }],
        },
      },
    },
    {
      embed: articleContent('ndlaembed[data-resource="audio"]').last(),
      data: articleContent('ndlaembed[data-resource="audio"]').last().data(),
      audio: {
        id: 2,
        title: { title: 'Tittel', language: 'Unknown' },
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
          mimeType: 'audio/mpeg',
        },
        copyright: {
          license: {
            license: 'CC-BY-SA-4.0',
            description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
            url: 'https://creativecommons.org/licenses/by-sa/2.0/',
          },
          creators: [{ type: 'writer', name: 'name' }],
          rightsholders: [{ type: 'processor', name: 'name' }],
          processors: [{ type: 'publisher', name: 'name' }],
        },
      },
    },
  ];

  const plugins = [createAudioPlugin()];

  await replaceEmbedsInHtml(embeds, 'nb', plugins);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace iframe embeds', async () => {
  const articleContent = parseHtml(
    '<section><ndlaembed data-resource="iframe" data-url="http://prezi.com" data-width="1" data-height="2"></ndlaembed></section>',
  );
  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="iframe"]'),
      data: articleContent('ndlaembed[data-resource="iframe"]').data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createIframePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace commoncraft embeds', async () => {
  const articleContent = parseHtml(
    '<section><ndlaembed data-resource="iframe" data-url="http://common.craft" data-width="1" data-height="2"></ndlaembed></section>',
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="iframe"]'),
      data: articleContent('ndlaembed[data-resource="iframe"]').data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createIframePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace ndla-filmiundervisning embeds', async () => {
  const articleContent = parseHtml(
    '<section><ndlaembed data-resource="iframe" data-url="http://ndla.filmiundervisning.no/" data-width="1" data-height="2"></ndlaembed></section>',
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="iframe"]'),
      data: articleContent('ndlaembed[data-resource="iframe"]').data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createIframePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace kahoot embeds', async () => {
  const articleContent = parseHtml(
    '<section><ndlaembed data-resource="iframe" data-url="https://embed.kahoot.it/e577f7e9-59ff-4a80-89a1-c95acf04815d" data-width="1" data-height="2"></ndlaembed></section>',
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="iframe"]'),
      data: articleContent('ndlaembed[data-resource="iframe"]').data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', [createIframePlugin()]);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace footnote embeds', async () => {
  const plugin = createFootnotePlugin();
  const plugins = [plugin];
  const articleContent = parseHtml(
    '<section>' +
      '<ndlaembed data-authors="regjeringen.no" data-edition="" data-publisher="Barne-, likestillings- og inkluderingsdepartmentet" data-resource="footnote" data-title="Likestilling kommer ikke av seg selv" data-type="Report" data-year="2013"></ndlaembed>' +
      '<ndlaembed data-authors="Me;You" data-edition="2" data-publisher="test" data-resource="footnote" data-title="test" data-type="Book" data-year="2022"></ndlaembed>' +
      '</section>',
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="footnote"]').first(),
      data: articleContent('ndlaembed[data-resource="footnote"]').first().data(),
    },
    {
      embed: articleContent('ndlaembed[data-resource="footnote"]').last(),
      data: articleContent('ndlaembed[data-resource="footnote"]').last().data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', plugins);
  const replaced = articleContent('body').html();

  expect(await getEmbedMetaData(embeds, 'nb', plugins)).toMatchSnapshot();
  expect(prettify(replaced)).toMatchSnapshot();
});

test('replacer/replaceEmbedsInHtml replace trinket embeds without resize', async () => {
  const plugin = createIframePlugin();
  const plugins = [plugin];
  const articleContent = parseHtml(
    '<section><ndlaembed data-resource="iframe" data-url="https://trinket.io/python/asdfesafadc" data-width="777" data-height="700"></ndlaembed></section>',
  );

  const embeds = [
    {
      embed: articleContent('ndlaembed[data-resource="iframe"]'),
      data: articleContent('ndlaembed[data-resource="iframe"]').data(),
    },
  ];

  await replaceEmbedsInHtml(embeds, 'nb', plugins);
  const replaced = articleContent('body').html();

  expect(prettify(replaced)).toMatchSnapshot();
});
