/**
 * Configuration can come from multiple sources (Env, Files, SSM Parameter
 * Store, etc.) and values are pulled from them based on a priority. The
 * ISourceType contains the priority and actual data of the source. A
 * description of the source is used for printing configurations
 * and/or debugging.
 */
export interface ISourceType {
  /**
   * Every source has a priority used to determine the final retrieved
   * value from the configuration. If no priority is provided, then one will
   * be calcuated based on when the Source was added to the configuration class.
   */
  priority?: number;
  /**
   * An optional description that can be used for things like printing
   * configurations and/or debugging.
   */
  description?: string;
  /**
   * The actual json returned by the source.
   */
  data: any;
}

/**
 * The IConfigSource source is an interface that is implemented by different
 * configuration sources such as files, environments, http endpoints,
 * key/value stores, etc.
 */
export interface IConfigSource {
  /**
   * Implementation is expected (upon promise resolution) to retrieve the
   * configuration, convert the results to json, and finally warp it in
   * an ISoureType object instance.
   */
  loadConfig(): Promise<ISourceType>;
}

/**
 * Aggregate of configuration environment made up of the platform, the compute
 * and environment.
 */
export interface IConfigEnvironment {
  platform: string;
  compute: string;
  environment: string;
}
