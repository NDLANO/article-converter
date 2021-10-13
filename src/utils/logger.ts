import bunyan from 'bunyan';

let log: any;

if (!log) {
  log = bunyan.createLogger({ name: 'article-converter' });
}

log.logAndReturnValue = (level: any, msg: any, value: any) => {
  log[level](msg, value);
  return value;
};

export default log;
