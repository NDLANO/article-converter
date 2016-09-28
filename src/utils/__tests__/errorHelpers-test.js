/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import { getAppropriateErrorResponse, createErrorPayload } from '../errorHelpers';


test('errorHelpers getAppropriateErrorResponse for simple error', t => {
  const response = getAppropriateErrorResponse(new Error('hello error'));

  t.deepEqual(response, {
    status: 500,
    message: 'hello error',
    description: '',
    stacktrace: '',
  });
});

test('errorHelpers getAppropriateErrorResponse with stacktrace', t => {
  const response = getAppropriateErrorResponse(new Error('hello error'), false);

  t.not(response.stacktrace, '');
});

test('errorHelpers getAppropriateErrorResponse for error with staus and json payload', t => {
  const error = createErrorPayload(404, 'Message', { description: 'Longer description' });

  const response = getAppropriateErrorResponse(error);

  t.deepEqual(response, {
    status: 404,
    message: 'Message',
    description: 'Longer description',
    stacktrace: '',
  });
});
