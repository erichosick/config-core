import { IConfigSource, ISourceType } from './types';
/**
 * FileSource supports loading configuration and settings from a file.
 * Supported file types are: .json, .ts.
 * NOTE: .yml and others will be moved to their own libraries.
 */
export declare class FileSource implements IConfigSource {
    #private;
    /**
     * Creates in instance of a FileSource.
     * @param fileAbsolutePath Absolute path to file which contains configuration.
     * @param rootOffset (Optional) Wraps configured json in the context of
     * properties here. A value of 'level-01.level02' would result in data
     * being placed in `{ level-01: {level-02: data}}`.
     */
    constructor(fileAbsolutePath: string, rootOffset?: string);
    /**
     * Returns file extension from an absolute path to the file.
     * @param fileAbsolutePath Absolute path to file.
     */
    private static _fileExtension;
    /**
     * Asynchronously loads the file configuration and converts it to json as needed.
     *
     * @Returns Return, upon promise resolution (await), an ISourceType containing
     * the configuration data.
     */
    loadConfig(): Promise<ISourceType>;
}
