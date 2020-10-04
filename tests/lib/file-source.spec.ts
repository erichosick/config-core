import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { FileSource } from '../../lib/index';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('filesource', () => {
  it('should expose library correctly', () => {
    expect(FileSource, 'should be a function').to.be.a('function');
  });

  describe('reading invalid files', () => {
    it('should exception when a file does not exist', async () => {
      const fileName = `${__dirname}/test-files/file-source/no-such-file-01.json`;
      const fileSource = new FileSource(fileName);
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `ENOENT: no such file or directory, open '${fileName}'`,
      );
    });

    it('should exception when a file extension is not supported', async () => {
      const fileName = `${__dirname}/test-files/file-source/file.noext`;
      const fileSource = new FileSource(fileName);
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `File extension 'noext' not supported`,
      );
    });

    it('should exception when a file extension is not provided', async () => {
      const fileName = `${__dirname}/test-files/file-source/file`;
      const fileSource = new FileSource(fileName);
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `File '${fileName}' is not a valid or is missing a file extension`,
      );
    });

    it('should exception when an empty file name is provided', async () => {
      const fileSource = new FileSource('');
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `File '' is not a valid or is missing a file extension`,
      );
    });
  });

  describe('reading a .json file', () => {
    it('should read from a valid .json file', async () => {
      const sourceType = await new FileSource(
        `${__dirname}/test-files/file-source/valid-01.json`,
      ).loadConfig();
      expect(sourceType.description, 'should have correct description').to.contain(
        'tests/lib/test-files/file-source/valid-01.json',
      );
      expect(sourceType.data, 'should have correct data loaded from file').to.deep.equal({
        test: 'valid-01.json',
      });
    });

    it('should exception when reading from an invalid .json file', async () => {
      const fileName = `${__dirname}/test-files/file-source/invalid-01.json`;
      const fileSource = new FileSource(fileName);
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `${fileName}: Unexpected token \n in JSON at position 34`,
      );
    });

    it('should read from an empty .json file creating an empty source.', async () => {
      const fileName = `${__dirname}/test-files/file-source/empty-01.json`;
      const fileSource = new FileSource(fileName);
      const sourceType = await fileSource.loadConfig();
      expect(sourceType.data, 'should be empty').to.deep.equal({});
    });
  });

  describe('reading a .ts file', () => {
    it('should read from a valid .ts file', async () => {
      const sourceType = await new FileSource(
        `${__dirname}/test-files/file-source/valid-01.ts`,
      ).loadConfig();
      expect(sourceType.description, 'should have correct description').to.contain(
        'tests/lib/test-files/file-source/valid-01.ts',
      );
      expect(sourceType.data, 'should have correct data loaded from file').to.deep.equal({
        test: 'valid-01.ts',
      });

      const sourceType2 = await new FileSource(
        `${__dirname}/test-files/file-source/valid-02.ts`,
      ).loadConfig();
      expect(sourceType2.data, 'should have correct data loaded from file').to.deep.equal({
        test: 'valid-02.ts',
      });
    });

    it('should exception when reading from a .ts file with multiple exports', async () => {
      const fileName = `${__dirname}/test-files/file-source/invalid-01.ts`;
      const fileSource = new FileSource(fileName);
      await expect(fileSource.loadConfig()).to.be.rejectedWith(
        `The typescript config file '${fileName}' must contain no more than one export`,
      );
    });

    it('should read from an empty .ts file creating an empty source.', async () => {
      const fileName = `${__dirname}/test-files/file-source/empty-01.ts`;
      const fileSource = new FileSource(fileName);
      const sourceType = await fileSource.loadConfig();
      expect(sourceType.data, 'should be empty').to.deep.equal({});
    });
  });

  describe('reading into a different root', () => {
    it(`should use the root provided in rootOffset as
        opposed to using default root`, async () => {
      const sourceType = await new FileSource(
        `${__dirname}/test-files/file-source/valid-01.ts`,
        'new.location',
      ).loadConfig();
      expect(sourceType.data, 'should have correct data loaded from file').to.deep.equal({
        new: { location: { test: 'valid-01.ts' } },
      });
    });

    it(`should not care if the rootOffset is empty string ('')`, async () => {
      const sourceType = await new FileSource(
        `${__dirname}/test-files/file-source/valid-01.ts`,
        '',
      ).loadConfig();
      expect(sourceType.data, 'should have correct data loaded from file').to.deep.equal({
        test: 'valid-01.ts',
      });
    });
  });
});
