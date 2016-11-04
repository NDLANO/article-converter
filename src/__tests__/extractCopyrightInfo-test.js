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
        copyright: {
          license: 'by-sa',
        },
        images: { full: { url: 'http://example.no/1234.jpg' } } },
    },
    {
      resource: 'audio',
      audio: {
        audioFiles: [
          {
            url: 'http://audio.no/file/voof.mp3',
            language: '',
          },
        ],
        copyright: {
          license: 'by-sa',
        },
      },
    },
    { resource: 'brightcove' }];

  const copyrights = extractCopyrightInfoFromEmbeds(embeds, 'nb');

  expect(copyrights.length).toBe(2);
  expect(copyrights[0]).toEqual(
    { type: 'image', copyright: { license: 'by-sa' }, src: 'http://example.no/1234.jpg' },
  );
  expect(copyrights[1]).toEqual(
    { type: 'audio', copyright: { license: 'by-sa' }, src: 'http://audio.no/file/voof.mp3' },
  );
});
