/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import prettier from 'prettier';
import bunyan from 'bunyan';
import getLogger from '../utils/logger';

// Use prettier to format html for better diffing. N.B. prettier html formating is currently experimental
export const prettify = (content: any) => prettier.format(`${content}`, { parser: 'html' });

export function withoutLog<T>(callback: () => Promise<T>): () => Promise<T> {
  return async () => {
    const log = getLogger();
    log.level(bunyan.FATAL + 1);
    const result = await callback();
    log.level(bunyan.INFO);
    return result;
  };
}

export function loglessTest<T>(name: string, callback: () => Promise<T>, timeout?: number): void {
  const fn = withoutLog(callback);
  return test(name, fn, timeout);
}
