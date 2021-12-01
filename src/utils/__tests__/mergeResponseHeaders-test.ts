/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mergeResponseHeaders } from '../mergeResponseHeaders';

it('private caches should "win" over "public"', () => {
  const testData: Record<string, string>[] = [
    {},
    { 'cache-control': 'public' },
    {
      'cache-control': 'public',
      'other-header': 'yep',
    },
    { 'cache-control': 'private' },
    { 'cache-control': 'public' },
  ];

  const response = mergeResponseHeaders(testData);

  expect(response).toEqual({
    'other-header': 'yep',
    'cache-control': 'private',
  });
});
