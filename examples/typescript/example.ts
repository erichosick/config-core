/* eslint-disable no-console */
import winston from 'winston';
import { config, FileSource } from 'config-core';

(async () => {
  try {
    await config.addSource(new FileSource(`${__dirname}/settings/settings-env.ts`));
    await config.addSource(new FileSource(`${__dirname}/settings/settings.ts`));
  } catch (e) {
    // loger not setup yet.
    console.log(e.message);
  }
  const transports = [];
  transports.push(new winston.transports.File({ filename: config.get('logging.fileName') }));
  if (config.env('NODE_ENV') === 'dev') {
    transports.push(new winston.transports.Console());
  }

  const logger = winston.createLogger({
    level: config.get('logging.level'),
    transports,
  });

  logger.log({ level: 'info', message: config.env('NODE_ENV') });
  logger.log({ level: 'info', message: config.get('databases.userDb.write') });
  logger.log({ level: 'info', message: config.get('service') });
})();
