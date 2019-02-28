#!/usr/bin/env node
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import app from './app';

const http = require('http');
const config = require('./config');

const server = http.createServer(app);

server.listen(config.port);
server.on('listening', () => {
  console.log(`Listening on ${config.port}`); // eslint-disable-line
});
