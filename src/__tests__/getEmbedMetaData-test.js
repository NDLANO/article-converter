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
  const embeds = [
    {
      data: { resource: 'image' },
      image: {
        title: { title: 'title' },
        alttext: { alttext: 'alt' },
        copyright: { license: 'by-sa' },
        imageUrl: 'http://example.no/1234.jpg',
      },
      plugin: imagePlugin,
    },
    {
      data: { resource: 'image' },
      image: {
        title: { title: 'title 2' },
        alttext: { alttext: 'alt 2' },
        copyright: { license: 'by-sa' },
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
        copyright: { license: 'by-sa' },
      },
      plugin: audioPlugin,
    },
    {
      data: { resource: 'brightcove', account: 'account', videoid: '1337' },
      brightcove: {
        name: 'video title',
        copyright: { license: 'by-sa' },
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
      plugin: brightcovePlugin,
    },
    {
      data: { resource: 'brightcove', account: 'account', videoid: '42' },
      brightcove: {
        copyright: { license: 'by-sa' },
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
      plugin: brightcovePlugin,
    },
  ];

  const copyrights = getEmbedMetaData(embeds);

  expect(copyrights).toMatchSnapshot();
});
