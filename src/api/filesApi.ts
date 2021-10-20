/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { convertToInternalUrlIfPossible } from '../utils/apiHelpers';

export async function checkIfFileExists(fileUrl: string): Promise<boolean> {
  const response = await fetch(convertToInternalUrlIfPossible(fileUrl), { method: 'HEAD' });
  return response.status === 200;
}