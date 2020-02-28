/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';

export async function checkIfFileExists(fileUrl) {
  const response = await fetch(fileUrl, { method: 'HEAD' });
  return response.status === 200;
}
