import bunyan from 'bunyan';

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'article-oembed' });
}

log.logAndReturnValue = (level, msg, value) => {
  log[level](msg, value);
  return value;
};

module.exports = log;
