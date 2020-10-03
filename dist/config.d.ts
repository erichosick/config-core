import { ISourceType, IConfigSource, IConfigEnvironment } from './types';
/**
 * Config is setup to read from multiple sources (using addSource) and then
 * provide easy access to configuration from multiple sources using the get
 * and env methods. See documentation for details.
 */
export declare class Config {
    #private;
    /**
     * Verifies that an item is an object.
     * @param item The item being verified.
     */
    private static isObject;
    /**
     * Deep copy merges provided items. TODO: deep copy.
     * @param lowerPrecidence The item we are merging into. Any values in
     * upperPrecidence will overwrite values in lowerPrecidence.
     * @param upperPrecidence The item we are merging from. Values in this
     * item will override values in the lowerPrecidence item.
     * @param path The initial path that we are merging items from. This is NOT
     * the active path we are merging. Used for error handling.
     */
    private static merge;
    /**
     * Returns all sources attached to the configuration instance.
     */
    get sources(): Array<ISourceType>;
    /**
     * AddSource adds a configuration source to the configuration instance by
     * first loading the configuration (loadConfig()), adding a priority and
     * finally pushing it to the sources() Array. See sources().
     * @param source - A configuration source (File, Environment, Http etc.)
     */
    addSource(source: IConfigSource): Promise<void>;
    /**
     * Returns any shell environment values if they were loaded.
     * @param key The shell environment name such as PATH, NODE_ENV, etc.
     * @ Returns The value associated with the key. If no value is found,
     *           null is returned.
     */
    env(key: string): any;
    /**
     * Validates and returns the current configuration environment.
     */
    getConfigEnvironment(): IConfigEnvironment;
    /**
     * Given an absoulute path, getAbsolute will pull the corrrect configuration
     * values out.
     * @param path Absolute path (including _shared, platform, process and env
     * path values)
     * @param property Used for error messages, the initial path we are pulling values
     * from not including the absoulute path values.
     * @param currentConfig The current configuration we are building. Items
     * located
     */
    getAbsolute(path: string, property: string, currentConfig?: any): any;
    /**
     * Given a path within the configruation hierarchy, get will pull the
     * correct configuration values automatically taking into account the
     * CONFIG_PLATFORM, CONFIG_COMPUTE, and NODE_ENV contexts.
     * @param path The path within the configuation hierarchy. An example path
     * would be 'user.name'.
     */
    get(path: string): any;
}
/**
 * A singleton config instance that can be shared throughout the application
 * If you would prefer not to use the singleton config pattern, then you can
 * always create your own config instance.
 */
export declare const config: Config;
