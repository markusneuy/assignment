import http from 'http';

import logger from './common/logger';
import config from './common/config';

import app from './app';

const server = http.createServer(app);

const handleException = async (err: Error | unknown): Promise<void> => {
  try {
    logger.warn({ err }, 'Stopping application');
    let timer: NodeJS.Timeout | undefined;

    const timerPromise = new Promise<number>((resolve) => {
      timer = setTimeout(() => {
        logger.error('Grace period ran out.');
        resolve(1);
      }, 2000);
    });

    const serverPromise = new Promise<number>((resolve) => {
      server.close(() => {
        clearTimeout(timer);
        logger.info('Shutting down normally');
        resolve(0);
      });
    });

    await Promise.race([timerPromise, serverPromise]).then((code: number) => process.exit(code));
  } catch {
    // ignore, because process exits
  }
  process.exit(1);
};

const init = () => {
  const { port } = config;

  server.listen(port, () => {
    logger.info({ port }, 'API is running');
  });
};

process.on('unhandledRejection', handleException);
process.on('uncaughtException', handleException);
process.on('SIGINT', handleException);
process.on('SIGTERM', handleException);

init();

export default server;
