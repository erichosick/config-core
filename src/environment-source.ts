import { IConfigSource, ISourceType } from '@ehosick/config-core-types';

/**
 * A configuration source for all shell environment variables placed at the
 * root node using the reserved word `_env`.
 */
// eslint-disable-next-line import/prefer-default-export
export class EnvironmentSource implements IConfigSource {
  /**
   * Asynchronously loads the all shell environment variables and
   * converts them to json as needed.
   */
  // NOTE: Other sources use 'this' but EnvironmentSource doesn't. To maintain
  // the same interface (not make this static), we disable the eslint warning.
  // eslint-disable-next-line class-methods-use-this
  public async loadConfig(): Promise<ISourceType> {
    return new Promise<ISourceType>((resolve) => {
      resolve({
        description: 'env',
        data: {
          // TODO: Verify that 'process' is available
          //       (is this being run in a browser?)
          // TODO: Allow the user to configure the root of the environment.
          //       but notify that this should not be changed if possible.
          // TODO: Allow a user to unflatten the env files so a value like
          //       NVM_DIR would be { nvm: { dir: ""}}
          _env: process.env,
        },
      });
    });
  }
}
