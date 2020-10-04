const winston = require('winston');
const { config, FileSource } = require('config-core');

(async () => {
  try {
    await config.addSource(new FileSource(`${__dirname}/settings/settings-env.json`));
    await config.addSource(new FileSource(`${__dirname}/settings/settings.json`));
  } catch (e) {
    // loger not setup yet so will log to console.
    /* eslint-disable no-console */
    console.log(e.message);
  }

  const transports = [
    new winston.transports.File({ filename: config.get('logging.fileName') }),
    config.env('NODE_ENV') === 'dev' ? new winston.transports.Console() : undefined,
  ];
  const logger = winston.createLogger({
    level: config.get('logging.level'),
    transports,
  });

  logger.log({ level: 'info', message: config.get('databases.userDb.write') });
  logger.log({ level: 'info', message: config.get('service') });

  const fileName = `${__dirname}/settings/setting-not-supported.ts`;
  try {
    await config.addSource(new FileSource(fileName));
  } catch (err) {
    logger.log({ level: 'error', message: `${err.message} in file ${fileName}` });
  }
})();
