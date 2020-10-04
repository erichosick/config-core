import { expect } from 'chai';

import { Config, EnvironmentSource, FileSource } from '../../lib/index';

describe('configuration get', async () => {
  describe('reading invalid files', () => {
    it('should exception when a file does not exist', async () => {
      let config = new Config();
      let fileName = `${__dirname}/test-files/config-get/no-such-file-01.ts`;

      await expect(config.addSource(new FileSource(fileName))).to.be.rejectedWith(
        `Cannot find module '${fileName}'`,
      );
    });
  });

  describe('config get missing environment', async () => {
    let config = new Config();
    await config.addSource(new EnvironmentSource());

    it('should exception when the environment is not setup correctly', () => {
      // Note: Might look like we have extra tests here, but we need to
      // consider all the possible "branches" to get 100% on branch testing.
      // Clean out environment variables for test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];

      expect(() => config.get('anyvalue')).to.throw(
        'Missing required environment variables: CONFIG_PLATFORM, CONFIG_COMPUTE, NODE_ENV',
      );

      // Mock an environment variable being set
      process.env['CONFIG_PLATFORM'] = 'set';
      expect(() => config.get('anyvalue')).to.throw(
        'Missing required environment variables: CONFIG_COMPUTE, NODE_ENV',
      );

      // Mock an environment variable being set
      process.env['CONFIG_COMPUTE'] = 'set';
      expect(() => config.get('anyvalue')).to.throw(
        'Missing required environment variables: NODE_ENV',
      );

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];

      // Mock an environment variable being set
      process.env['NODE_ENV'] = 'set';
      expect(() => config.get('anyvalue')).to.throw(
        'Missing required environment variables: CONFIG_PLATFORM, CONFIG_COMPUTE',
      );

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];
    });
  });

  describe('config get object using single file', async () => {
    let config = new Config();
    await config.addSource(new EnvironmentSource());
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-layer-01.ts`));

    it('should get serviceContext', () => {
      process.env['CONFIG_PLATFORM'] = 'goldenCRM';
      process.env['CONFIG_COMPUTE'] = 'userAPI';
      process.env['NODE_ENV'] = 'dev';

      const serviceContext = config.get('serviceContext');
      expect(serviceContext).to.deep.equal({
        shareShareShare: '_shared._shared._shared',
        shareShareEnv: '_shared._shared.dev',
        shareComputeShare: '_shared.userAPI._shared',
        shareComputeEnv: '_shared.userAPI.dev',
        platformShareShare: 'goldenCRM._shared._shared',
        platformShareEnv: 'goldenCRM._shared.dev',
        platformComputeShare: 'goldenCRM.userAPI._shared',
        platformComputeEnv: 'goldenCRM.userAPI.dev',

        shareShareShare1: '_shared._shared._shared',
        shareShareEnv1: '_shared._shared.dev',
        shareComputeShare1: '_shared.userAPI._shared',
        shareComputeEnv1: '_shared.userAPI.dev',
        platformShareShare1: 'goldenCRM._shared._shared',
        platformShareEnv1: 'goldenCRM._shared.dev',
        platformComputeShare1: 'goldenCRM.userAPI._shared',
        platformComputeEnv1: 'goldenCRM.userAPI.dev',
      });

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];
    });
  });

  describe('config get object using multiple files', async () => {
    let config = new Config();
    await config.addSource(new EnvironmentSource());
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-layer-01.ts`));
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-empty.ts`));
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-layer-02.ts`));

    it('should get serviceContext', () => {
      process.env['CONFIG_PLATFORM'] = 'goldenCRM';
      process.env['CONFIG_COMPUTE'] = 'userAPI';
      process.env['NODE_ENV'] = 'dev';

      const serviceContext = config.get('serviceContext');
      expect(serviceContext).to.deep.equal({
        // Values pulled from config-layer-01
        shareShareShare1: '_shared._shared._shared',
        shareShareEnv1: '_shared._shared.dev',
        shareComputeShare1: '_shared.userAPI._shared',
        shareComputeEnv1: '_shared.userAPI.dev',
        platformShareShare1: 'goldenCRM._shared._shared',
        platformShareEnv1: 'goldenCRM._shared.dev',
        platformComputeShare1: 'goldenCRM.userAPI._shared',
        platformComputeEnv1: 'goldenCRM.userAPI.dev',

        // Values pulled from config-layer-02 overide layer01
        shareShareShare: '_shared._shared._shared2',
        shareShareEnv: '_shared._shared.dev2',
        shareComputeShare: '_shared.userAPI._shared2',
        shareComputeEnv: '_shared.userAPI.dev2',
        platformShareShare: 'goldenCRM._shared._shared2',
        platformShareEnv: 'goldenCRM._shared.dev2',
        platformComputeShare: 'goldenCRM.userAPI._shared2',
        platformComputeEnv: 'goldenCRM.userAPI.dev2',

        // Values pulled from config-layer-02
        shareShareShare2: '_shared._shared._shared3',
        shareShareEnv2: '_shared._shared.dev3',
        shareComputeShare2: '_shared.userAPI._shared3',
        shareComputeEnv2: '_shared.userAPI.dev3',
        platformShareShare2: 'goldenCRM._shared._shared3',
        platformShareEnv2: 'goldenCRM._shared.dev3',
        platformComputeShare2: 'goldenCRM.userAPI._shared3',
        platformComputeEnv2: 'goldenCRM.userAPI.dev3',
      });

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];
    });

    it('should exception when trying to merge a property and an object', () => {
      process.env['CONFIG_PLATFORM'] = 'goldenCRM';
      process.env['CONFIG_COMPUTE'] = 'userAPI';
      process.env['NODE_ENV'] = 'dev';

      expect(() => config.get('primiObjProperty')).to.throw(
        `Property 'primiObjProperty' resolves to a primitive and an object which can not be merged`,
      );

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];
    });
  });

  describe('config get primitive using multiple files', async () => {
    let config = new Config();
    await config.addSource(new EnvironmentSource());
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-layer-01.ts`));
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-empty.ts`));
    await config.addSource(new FileSource(`${__dirname}/test-files/config-get/config-layer-02.ts`));

    it('should get serviceContext', () => {
      process.env['CONFIG_PLATFORM'] = 'goldenCRM';
      process.env['CONFIG_COMPUTE'] = 'userAPI';
      process.env['NODE_ENV'] = 'dev';

      const serviceContext = config.get('serviceContext.shareShareShare');
      expect(config.get('serviceContext.shareShareShare')).to.equal('_shared._shared._shared2');
      expect(config.get('serviceContext.shareShareShare1')).to.equal('_shared._shared._shared');
      expect(config.get('serviceContext.shareShareShare2')).to.equal('_shared._shared._shared3');

      // Cleanup test
      delete process.env['CONFIG_PLATFORM'];
      delete process.env['CONFIG_COMPUTE'];
      delete process.env['NODE_ENV'];
    });
  });
});
