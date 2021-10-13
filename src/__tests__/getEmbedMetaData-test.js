/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getEmbedMetaData from '../getEmbedMetaData';
import createImagePlugin from '../plugins/imagePlugin';
import createAudioPlugin from '../plugins/audioPlugin';
import createBrightcovePlugin from '../plugins/brightcovePlugin';

const imagePlugin = createImagePlugin();
const audioPlugin = createAudioPlugin();
const brightcovePlugin = createBrightcovePlugin();

test('get meta data from embeds', async () => {
  const plugins = [imagePlugin, audioPlugin, brightcovePlugin];
  const embeds = [
    {
      data: { resource: 'image' },
      image: {
        title: { title: 'title' },
        alttext: { alttext: 'alt' },
        copyright: { license: 'CC-BY-SA-4.0' },
        imageUrl: 'http://example.no/1234.jpg',
      },
    },
    {
      data: { resource: 'image' },
      image: {
        title: { title: 'title 2' },
        alttext: { alttext: 'alt 2' },
        copyright: { license: 'CC-BY-SA-4.0' },
        imageUrl: 'http://example.no/4123.jpg',
      },
    },
    {
      data: { resource: 'audio' },
      audio: {
        title: { title: 'Tittel' },
        language: 'nb',
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
        },
        copyright: { license: 'CC-BY-SA-4.0' },
      },
    },
    {
      data: { resource: 'brightcove', account: 'account', videoid: '1337' },
      brightcove: {
        name: 'video title',
        description: 'video description',
        copyright: { license: 'CC-BY-SA-4.0' },
        published_at: '2020-01-01T11:12:13.456Z',
        images: {
          poster: {
            src: 'https://image.no/123.jpg',
          },
        },
        sources: [
          {
            src: 'test3.mp4',
            container: 'STREAM',
            size: 3,
            width: 1000,
            height: 600,
          },
          {
            src: 'test4.mp4',
            container: 'MP4',
            size: 4,
          },
        ],
      },
    },
    {
      data: { resource: 'brightcove', account: 'account', videoid: '42' },
      brightcove: {
        copyright: { license: 'CC-BY-SA-4.0' },
        sources: [
          {
            src: 'test3.mp4',
            container: 'MP4',
            size: 3,
          },
          {
            src: 'test4.mp4',
            container: 'MP4',
            size: 4,
          },
        ],
      },
    },
  ];

  const copyrights = await getEmbedMetaData(embeds, 'nb', plugins);
  expect(copyrights).toMatchSnapshot();
});
