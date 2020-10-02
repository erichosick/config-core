/**
 * Configuration values in a shared source (such as Parameter Store) would
 * usually contain:
 *   * Values shared between multiple platforms or services
 *   * Passwords or other credentials
 */

export const config = {
  // For all platforms
  _shared: {
    // For all Services
    _shared: {
      // For all environments
      _shared: {
        // use following configuration
        serviceContext: {
          shareShareShare: '_shared._shared._shared2',
          shareShareShare2: '_shared._shared._shared3',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          shareShareEnv: '_shared._shared.dev2',
          shareShareEnv2: '_shared._shared.dev3',
        },
      },
    },
    // For specific App, API, Lambda, etc.
    userAPI: {
      // For any environment
      _shared: {
        // use following configuration
        serviceContext: {
          shareComputeShare: '_shared.userAPI._shared2',
          shareComputeShare2: '_shared.userAPI._shared3',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          shareComputeEnv: '_shared.userAPI.dev2',
          shareComputeEnv2: '_shared.userAPI.dev3',
        },
      },
    },
  },

  // For only the goldenCRM platform
  goldenCRM: {
    // For any compute
    _shared: {
      // For any environment
      _shared: {
        // use following configuration
        serviceContext: {
          platformShareShare: 'goldenCRM._shared._shared2',
          platformShareShare2: 'goldenCRM._shared._shared3',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          platformShareEnv: 'goldenCRM._shared.dev2',
          platformShareEnv2: 'goldenCRM._shared.dev3',
        },
      },
    },
    // For specific App, API, Lambda, etc.
    userAPI: {
      // For any environment
      _shared: {
        // use following configuration
        serviceContext: {
          platformComputeShare: 'goldenCRM.userAPI._shared2',
          platformComputeShare2: 'goldenCRM.userAPI._shared3',
        },
      },
      // For specific dev environment
      dev: {
        // use following configuration
        serviceContext: {
          platformComputeEnv: 'goldenCRM.userAPI.dev2',
          platformComputeEnv2: 'goldenCRM.userAPI.dev3',
        },
      },
    },
  },
};
