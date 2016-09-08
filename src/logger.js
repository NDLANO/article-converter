import bunyan from 'bunyan';

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'article-oembed' });
}
module.exports = log;
