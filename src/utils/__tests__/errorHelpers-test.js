/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAppropriateErrorResponse, createErrorPayload } from '../errorHelpers';


it('errorHelpers getAppropriateErrorResponse for simple error', () => {
  const response = getAppropriateErrorResponse(new Error('hello error'));

  expect(response).toEqual({
    status: 500,
    message: 'hello error',
    description: '',
    stacktrace: '',
  });
});

it('errorHelpers getAppropriateErrorResponse with stacktrace', () => {
  const response = getAppropriateErrorResponse(new Error('hello error'), false);

  expect(response.stacktrace).not.toBe('');
});

it('errorHelpers getAppropriateErrorResponse for error with staus and json payload', () => {
  const error = createErrorPayload(404, 'Message', { description: 'Longer description' });

  const response = getAppropriateErrorResponse(error);

  expect(response).toEqual({
    status: 404,
    message: 'Message',
    description: 'Longer description',
    stacktrace: '',
  });
});
