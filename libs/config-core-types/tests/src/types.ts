import { expect } from 'chai';
import { ISourceType, IConfigSource, IConfigEnvironment } from '../../src/index';

describe('types', () => {
  describe('ISourceType', () => {
    it('should expose ISourceType library correctly', () => {
      const sourceType: ISourceType = {
        priority: 10,
        description: 'Testing interface',
        data: { any: 'object ' },
      };

      expect(sourceType, 'should be an ISourceType').to.be.an('object');
    });
  });

  describe('IConfigEnvironment', () => {
    it('should expose IConfigEnvironment library correctly', () => {
      const configEnvironment: IConfigEnvironment = {
        platform: 'testing',
        compute: 'interface',
        environment: 'testing',
      };

      expect(configEnvironment, 'should be an IConfigEnvironment').to.be.an('object');
    });
  });

  describe('IConfigSource', () => {
    it('should expose IConfigSource library correctly', async () => {
      class TestSource implements IConfigSource {
        public loadConfig(): Promise<ISourceType> {
          return new Promise<ISourceType>((resolve) => {
            resolve({
              description: 'env',
              data: {},
            });
          });
        }
      }

      expect(TestSource, 'should be a TestSource').to.be.a('function');
      const testSource = new TestSource();
      expect(await testSource.loadConfig()).to.deep.equal({
        description: 'env',
        data: {},
      });
    });
  });
});
