/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { convertToInternalUrlIfPossible } from '../utils/apiHelpers';
import { ndlaFetch } from './ndlaFetch';

export async function checkIfFileExists(fileUrl: string): Promise<boolean> {
  const response = await ndlaFetch(convertToInternalUrlIfPossible(fileUrl), { method: 'HEAD' });
  return response.status === 200;
}
