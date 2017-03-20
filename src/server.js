#!/usr/bin/env node
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable */

var http = require('http');

require('babel-register');
require('babel-polyfill');
var app = require('./app');
var config = require('./config')

var server = http.createServer(app);

server.listen(config.port);
server.on('listening', () => {
 console.log('Listening on ' + config.port);
});
/* eslint-enable */
