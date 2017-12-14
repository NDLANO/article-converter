import bunyan from 'bunyan';

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'article-converter' });
  // console.log(log);
}

log.logAndReturnValue = (level, msg, value) => {
  log[level](msg, value);
  return value;
};

module.exports = log;
