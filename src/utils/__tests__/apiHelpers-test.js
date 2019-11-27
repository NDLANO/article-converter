/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { convertToInternalUrlIfPossible } from '../apiHelpers';

it('errorHelpers getAppropriateErrorResponse with stacktrace', () => {
  const urlsToConvert = [
    [
      'https://staging.api.ndla.no/article-api/v2/articles?query=1',
      'http://ndla-api/article-api/v2/articles?query=1',
    ],
    [
      'https://ff.api.ndla.no/graphql-api/v2/articles?query=1',
      'http://ndla-api/graphql-api/v2/articles?query=1',
    ],
    [
      'https://api.ndla.no/article-api/v2/articles?query=1',
      'http://ndla-api/article-api/v2/articles?query=1',
    ],
    [
      'https://test.api.ndla.no/article-api/v2/articles?query=1',
      'http://ndla-api/article-api/v2/articles?query=1',
    ],
    [
      'https://test.api.ndla.no/oembed-proxy/v1/oembed?url=https://ndla.no/article/123',
      'http://ndla-api/oembed-proxy/v1/oembed?url=https://ndla.no/article/123',
    ],
    [
      'https://test.api.ndla.no?url=https://ndla.no/article/123',
      'http://ndla-api?url=https://ndla.no/article/123',
    ],
    [
      'https://someotheroembed?url=https://ndla.no/article/123',
      'https://someotheroembed?url=https://ndla.no/article/123',
    ],
    ['https://api.test.ndla.no/', 'http://ndla-api/'],
    ['https://www.test.api.ndla.no/', 'https://www.test.api.ndla.no/'],
    ['https://www.api.ndla.no/', 'https://www.api.ndla.no/'],
    ['https://www.ndla.no/', 'https://www.ndla.no/'],
    ['https://ndla.no/', 'https://ndla.no/'],
    ['https://www.test.ndla.no/', 'https://www.test.ndla.no/'],
    ['https://test.ndla.no/', 'https://test.ndla.no/'],
    ['https://example.com/test/?skvip', 'https://example.com/test/?skvip'],
  ];

  urlsToConvert.map(testObj => {
    expect(convertToInternalUrlIfPossible(testObj[0])).toBe(testObj[1]);
  });
});
