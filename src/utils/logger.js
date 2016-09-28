import bunyan from 'bunyan';

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'article-oembed' });
}

log.logAndReturnValue = (level, value, msg) => {
  log[level](msg, value);
  return value;
};

module.exports = log;
