/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import bunyan from 'bunyan';
import Logger from 'bunyan';
import { AsyncLocalStorage } from 'node:async_hooks';

export const loggerStorage = new AsyncLocalStorage<Logger>();

const baseLogger = bunyan.createLogger({ name: 'article-converter' });

export function getLogger(): Logger {
  const storedLogger = loggerStorage.getStore();
  if (!storedLogger) {
    return baseLogger;
  }

  return storedLogger;
}

export default getLogger;
