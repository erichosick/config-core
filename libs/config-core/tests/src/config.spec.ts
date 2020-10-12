import { expect } from 'chai';
import { Config, config, EnvironmentSource } from '../../src/index';

describe('configuration', () => {
  it('should expose library correctly', () => {
    expect(config, 'should be an object instance').to.be.an('object');
    expect(Config, 'should be a function').to.be.a('function');
  });

  describe('config singleton', async () => {
    it('should have no sources', () => {
      expect(config.sources, 'should have no source set').to.be.empty;
    });
    it('should have a source when one is added', async () => {
      await config.addSource(new EnvironmentSource());
      const src = config.sources;
      expect(src.length, 'should have no source set').to.equal(1);
    });
  });
});
