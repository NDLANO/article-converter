#!/usr/bin/env node

/* eslint-disable */

var http = require('http');

require('babel-register');
var app = require('./app');
var config = require('../src/config')

var server = http.createServer(app);

server.listen(config.port);
server.on('listening', () => {
 console.log('Listening on ' + config.port);
});
/* eslint-enable */
