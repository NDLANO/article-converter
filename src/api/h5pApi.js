/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { h5pHost } from '../config.js';

import {
  resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';

const getHeaders = () => ({
  headers: {
    'content-type': 'Content-Type: application/json',
  },
});

export const fetchH5p = async id => {
  const url = `${h5pHost}/v1/resource/${id}/copyright`;
  // const url = 'https://jsonplaceholder.typicode.com/todos/1'; // for testing
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getHeaders(),
    });
    const result = await resolveJsonOrRejectWithError(response);
    return result;
  } catch (e) {
    return null;
  }
}
