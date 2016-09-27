/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';

/**
* Get appropriate error object with correct status. Defaults to
* striping stacktrace.
*
* @param {object} error Error object
* @param {bool} isProduction strip stacktrace if true
* @returns {object} appropriate error resonse object
*/
export const getAppropriateErrorResponse = (error, isProduction = true) => {
  const status = defined(error.status, 500); // Default to 500 if no status is provided
  const { description } = defined(error.json, { description: '' });
  const message = error.message;

  if (isProduction) {
    return { status, message, description, stacktrace: '' };
  }
  return { status, message, description, stacktrace: error.stack };
};
