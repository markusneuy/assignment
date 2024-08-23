import pino from 'pino';
import config from './config';

const logger = pino({
  level: config.logLevel,
  timestamp: true,
});

export default logger;
