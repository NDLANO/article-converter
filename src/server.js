#!/usr/bin/env node

/* eslint-disable */

var http = require('http');

require('babel-register');

var app = require('./app');

var server = http.createServer(app);

server.listen(3000);
server.on('listening', () => {
 console.log('Listening on 3000');
});
/* eslint-enable */
