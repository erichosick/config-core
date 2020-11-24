import winston from 'winston';
import { config, FileSource } from 'config-core';

(async () => {
  try {
    await config.addSource(new FileSource(`${__dirname}/settings/settings-env.ts`));
    await config.addSource(new FileSource(`${__dirname}/settings/settings.ts`));
  } catch (e) {
    // loger not setup yet so will log to console.
    /* eslint-disable no-console */
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

  logger.log({ level: 'info', message: `Node Environment is '${config.env('NODE_ENV')}'.` });
  logger.log({
    level: 'info',
    message: 'Write database configuration for userDb database.',
    data: config.get('databases.userDb.write'),
  });
  logger.log({ level: 'info', message: 'Service configuration', data: config.get('service') });
})();
