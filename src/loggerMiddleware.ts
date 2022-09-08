/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { uuid } from '@ndla/util';
import { NextFunction, Request, Response } from 'express';
import bunyan from 'bunyan';
import { getAsString } from './routes';
import { loggerStorage } from './utils/logger';

export function setupLogger(correlationId: string, next: NextFunction): void {
  loggerStorage.run(
    bunyan.createLogger({
      name: 'article-converter',
      correlationId,
    }),
    () => {
      next();
    },
  );
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const fromReq = getAsString(req.headers['x-correlation-id']);
  const cid = !!fromReq ? fromReq : uuid();

  setupLogger(cid, next);
};

export default loggerMiddleware;
