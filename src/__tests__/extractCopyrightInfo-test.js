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
    { resource: 'content-link' },
    { resource: 'h5p' },
    {
      resource: 'image',
      image: {
        copyright: { license: 'by-sa' },
        imageUrl: 'http://example.no/1234.jpg',
      },
    },
    {
      resource: 'image',
      image: {
        copyright: { license: 'by-sa' },
        imageUrl: 'http://example.no/4123.jpg',
      },
    },
    {
      resource: 'audio',
      audio: {
        titles: [
          { title: 'Tittel', language: 'nb' },
          { title: 'Title', language: 'en' },
        ],
        audioFiles: [
          {
            url: 'http://audio.no/file/voof.mp3',
            language: '',
          },
        ],
        copyright: { license: 'by-sa' },
      },
    },
    { resource: 'brightcove' }];

  const copyrights = extractCopyrightInfoFromEmbeds(embeds, 'nb');

  expect(copyrights.image.length).toBe(2);
  expect(copyrights.image).toEqual([
    { type: 'image', copyright: { license: 'by-sa' }, src: 'http://example.no/1234.jpg' },
    { type: 'image', copyright: { license: 'by-sa' }, src: 'http://example.no/4123.jpg' },
  ]);

  expect(copyrights.audio.length).toBe(1);
  expect(copyrights.audio).toEqual([
    { type: 'audio', title: 'Tittel', copyright: { license: 'by-sa' }, src: 'http://audio.no/file/voof.mp3' },
  ]);
});
