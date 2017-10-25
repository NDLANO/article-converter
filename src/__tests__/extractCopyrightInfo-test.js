/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { extractCopyrightInfoFromEmbeds } from '../extractCopyrightInfo';

it('extractCopyrightInfo from embeds', async () => {
  const embeds = [
    { data: { resource: 'content-link' } },
    { data: { resource: 'h5p' } },
    {
      data: { resource: 'image' },
      image: {
        copyright: { license: 'by-sa' },
        imageUrl: 'http://example.no/1234.jpg',
      },
    },
    {
      data: { resource: 'image' },
      image: {
        copyright: { license: 'by-sa' },
        imageUrl: 'http://example.no/4123.jpg',
      },
    },
    {
      data: { resource: 'audio' },
      audio: {
        title: 'Tittel',
        language: 'nb',
        audioFile: {
          url: 'http://audio.no/file/voof.mp3',
        },
        copyright: { license: 'by-sa' },
      },
    },
    {
      data: { resource: 'brightcove' },
      brightcove: {
        copyright: { license: 'by-sa' },
      },
    },
    {
      data: { resource: 'brightcove' },
      brightcove: {
        copyright: { license: 'by-sa' },
        images: {
          poster: {
            src: 'https://image.no/123.jpg',
          },
        },
      },
    },
  ];

  const copyrights = extractCopyrightInfoFromEmbeds(embeds);

  expect(copyrights).toMatchSnapshot();
});
