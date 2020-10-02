import { expect } from 'chai';
import { Config, EnvironmentSource, FileSource } from '../../lib/index';

describe('configuration environment', async () => {
  let config = new Config();
  await config.addSource(new EnvironmentSource());
  await config.addSource(
    new FileSource(`${__dirname}/test-files/environment-source/valid-01.json`),
  );

  describe('config env', () => {
    it('should get an environment value located at _env', () => {
      // "Mock" that these environment variables have been set
      process.env['CONFIG_PLATFORM'] = 'specialCrm';
      process.env['NODE_ENV'] = 'dev';

      expect(config.env('CONFIG_PLATFORM'), 'value came from EnvironmentSource').to.equal(
        'specialCrm',
      );
      expect(config.env('CONFIG_COMPUTE'), 'value came from the file').to.equal('restApi');
      expect(config.env('NO_ENV-VAR')).to.be.null;

      // Clean up test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['NODE_ENV'];
    });
  });
});
