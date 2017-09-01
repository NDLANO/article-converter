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
  ];

  const copyrights = extractCopyrightInfoFromEmbeds(embeds);

  expect(copyrights.image.length).toBe(2);
  expect(copyrights.image).toEqual([
    {
      type: 'image',
      copyright: { license: 'by-sa' },
      src: 'http://example.no/1234.jpg',
    },
    {
      type: 'image',
      copyright: { license: 'by-sa' },
      src: 'http://example.no/4123.jpg',
    },
  ]);

  expect(copyrights.audio.length).toBe(1);
  expect(copyrights.audio).toEqual([
    {
      type: 'audio',
      title: 'Tittel',
      copyright: { license: 'by-sa' },
      src: 'http://audio.no/file/voof.mp3',
    },
  ]);
});
