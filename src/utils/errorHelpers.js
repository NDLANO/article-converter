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

/**
* Create a new Error with additional info
*
* @param {number} status Http status to include in error. May be used to determin appropriate response to client
* @param {string} message Message used when initializing the new Error object
* @param {object} json JSON response from failed api calls
* @returns {object} Error object with additional info
*/
export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}
