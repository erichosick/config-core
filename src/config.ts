import { ISourceType, IConfigSource, IConfigContext } from '@ehosick/config-core-types';

/**
 * Config is setup to read from multiple sources (using addSource) and then
 * provide easy access to configuration from multiple sources using the get
 * and env methods. See documentation for details.
 */
export class Config {
  /* Sources that have been attached to the Config instance */
  #sources: Array<ISourceType> = [];

  /**
   * Verifies that an item is an object.
   * @param item The item being verified.
   */
  private static isObject(item: any): boolean {
    return item === null ? false : typeof item === 'object';
  }

  /**
   * Deep copy merges provided items. TODO: deep copy.
   * @param lowerPrecidence The item we are merging into. Any values in
   * upperPrecidence will overwrite values in lowerPrecidence.
   * @param upperPrecidence The item we are merging from. Values in this
   * item will override values in the lowerPrecidence item.
   * @param path The initial path that we are merging items from. This is NOT
   * the active path we are merging. Used for error handling.
   */
  private static merge(lowerPrecidence: any, upperPrecidence: any, path: string): any {
    let isLowerObj = Config.isObject(lowerPrecidence);
    let isUpperObj = Config.isObject(upperPrecidence);

    if (null === lowerPrecidence || undefined === lowerPrecidence) {
      return upperPrecidence;
    }
    // NOTE: For our usage of merge, there is never a case where the
    //       upperPrecidence is null but the lower one is not (so far). This
    //       case has been considered and found not necessary
    //  else if (null === upperPrecidence || undefined === upperPrecidence) {
    //   return lowerPrecidence;
    // }
    else if (isLowerObj && isUpperObj) {
      return { ...lowerPrecidence, ...upperPrecidence };
    } else if (isLowerObj || isUpperObj) {
      throw new Error(
        `Property '${path}' resolves to a primitive and an object which can not be merged`,
      );
    } else {
      return upperPrecidence;
    }
  }

  /**
   * Returns all sources attached to the configuration instance.
   */
  get sources(): Array<ISourceType> {
    return this.#sources;
  }

  /**
   * AddSource adds a configuration source to the configuration instance by
   * first loading the configuration (loadConfig()), and
   * finally pushing it to the sources() Array. See sources().
   * @param source - A configuration source (File, Environment, Http etc.)
   */
  public async addSource(source: IConfigSource): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const sourceType = await source.loadConfig();
        this.#sources.push(sourceType);
      } catch (error) {
        reject(error);
      }
      resolve();
    });
  }

  /**
   * Returns any shell environment values if they were loaded.
   * @param key The shell environment name such as PATH, NODE_ENV, etc.
   * @ Returns The value associated with the key. If no value is found,
   *           null is returned.
   */
  public env(key: string): any {
    let result = null;
    this.#sources.forEach((sources: ISourceType) => {
      if (sources.data.hasOwnProperty('_env')) {
        let item = sources.data._env;
        result = item.hasOwnProperty(key) ? Config.merge(result, item[key], key) : result;
      }
    });
    return result;
  }

  /**
   * Validates and returns the current configuration environment.
   *
   * @throws An error if one of the required configuration environment
   * variables are missing (CONFIG_PLATFORM, CONFIG_COMPUTE, NODE_ENV)
   */
  public getConfigEnvironment(): IConfigContext {
    const env = {
      platform: this.env('CONFIG_PLATFORM'),
      compute: this.env('CONFIG_COMPUTE'),
      environment: this.env('NODE_ENV'),
    };
    if (!env.platform || !env.compute || !env.environment) {
      const missing = [];
      if (!env.platform) {
        missing.push('CONFIG_PLATFORM');
      }
      if (!env.compute) {
        missing.push('CONFIG_COMPUTE');
      }
      if (!env.environment) {
        missing.push('NODE_ENV');
      }

      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    return env;
  }

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
  public getAbsolute(path: string, property: string, currentConfig: any = undefined): any {
    const properties = path.split('.');

    this.sources.forEach((source: ISourceType) => {
      let current = source.data;
      properties.forEach((prop, index) => {
        if (current.hasOwnProperty(prop)) {
          if (index + 1 === properties.length) {
            currentConfig = Config.merge(currentConfig, current[prop], property);
          } else {
            current = current[prop];
          }
        }
      });
    });
    return currentConfig;
  }

  /**
   * Given a path within the configruation hierarchy, get will pull the
   * correct configuration values automatically taking into account the
   * CONFIG_PLATFORM, CONFIG_COMPUTE, and NODE_ENV contexts.
   * @param path The path within the configuation hierarchy. An example path
   * would be 'user.name'.
   */
  public get(path: string): any {
    const env = this.getConfigEnvironment();

    // Merging of configurations always starts from least specific
    // to most specific. From _shared._shared._shared to specific
    // platform.compute.env.
    // NOTE: Code could probably be refactored but this makes it easy to read.
    let result = this.getAbsolute(`_shared._shared._shared.${path}`, path);
    result = this.getAbsolute(`_shared._shared.${env.environment}.${path}`, path, result);
    result = this.getAbsolute(`_shared.${env.compute}._shared.${path}`, path, result);
    result = this.getAbsolute(`_shared.${env.compute}.${env.environment}.${path}`, path, result);
    result = this.getAbsolute(`${env.platform}._shared._shared.${path}`, path, result);
    result = this.getAbsolute(`${env.platform}._shared.${env.environment}.${path}`, path, result);
    result = this.getAbsolute(`${env.platform}.${env.compute}._shared.${path}`, path, result);
    result = this.getAbsolute(
      `${env.platform}.${env.compute}.${env.environment}.${path}`,
      path,
      result,
    );

    return result;
  }
}

/**
 * A singleton config instance that can be shared throughout the application
 * If you would prefer not to use the singleton config pattern, then you can
 * always create your own config instance.
 */
export const config = new Config();
