import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { EnvironmentSource } from '../../src/index';

const expect = chai.expect;
chai.use(chaiAsPromised);

async () => {
  console.log('whatever');
};

describe('environmentsource', () => {
  it(' should expose library correctly', () => {
    expect(EnvironmentSource, 'should be a function').to.be.a('function');
  });

  describe('reading environment', () => {
    it('should successfully read the environment', async () => {
      process.env['SOME_VAL'] = 'some_val';
      const envData = await new EnvironmentSource().loadConfig();
      expect(envData.data).to.haveOwnProperty('_env');
      expect(envData.data._env['SOME_VAL']).to.equal('some_val');
    });
  });
});
