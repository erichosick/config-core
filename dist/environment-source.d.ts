import { IConfigSource, ISourceType } from './types';
/**
 * A configuration source for all shell environment variables placed at the
 * root node using the reserved word `_env`.
 */
export declare class EnvironmentSource implements IConfigSource {
    /**
     * Asynchronously loads the all shell environment variables and
     * converts them to json as needed.
     */
    loadConfig(): Promise<ISourceType>;
}
