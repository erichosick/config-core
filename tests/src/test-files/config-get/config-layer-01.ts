/**
 * Configuration values in a shared source (such as Parameter Store) would
 * usually contain:
 *   * Values shared between multiple platforms or services
 *   * Passwords or other credentials
 */

export default {
  // For all platforms
  _shared: {
    // For all Services
    _shared: {
      // For all environments
      _shared: {
        primiObjProperty: 'string',
        // use following configuration
        serviceContext: {
          shareShareShare: '_shared._shared._shared',
          shareShareShare1: '_shared._shared._shared',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          shareShareEnv: '_shared._shared.dev',
          shareShareEnv1: '_shared._shared.dev',
        },
      },
    },
    // For specific App, API, Lambda, etc.
    userAPI: {
      // For any environment
      _shared: {
        // use following configuration
        serviceContext: {
          shareComputeShare: '_shared.userAPI._shared',
          shareComputeShare1: '_shared.userAPI._shared',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          shareComputeEnv: '_shared.userAPI.dev',
          shareComputeEnv1: '_shared.userAPI.dev',
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
        primiObjProperty: {
          an: 'object',
        },

        // use following configuration
        serviceContext: {
          platformShareShare: 'goldenCRM._shared._shared',
          platformShareShare1: 'goldenCRM._shared._shared',
        },
      },
      // For specific 'dev' environment
      dev: {
        // use following configuration
        serviceContext: {
          platformShareEnv: 'goldenCRM._shared.dev',
          platformShareEnv1: 'goldenCRM._shared.dev',
        },
      },
    },
    // For specific App, API, Lambda, etc.
    userAPI: {
      // For any environment
      _shared: {
        // use following configuration
        serviceContext: {
          platformComputeShare: 'goldenCRM.userAPI._shared',
          platformComputeShare1: 'goldenCRM.userAPI._shared',
        },
      },
      // For specific dev environment
      dev: {
        // use following configuration
        serviceContext: {
          platformComputeEnv: 'goldenCRM.userAPI.dev',
          platformComputeEnv1: 'goldenCRM.userAPI.dev',
        },
      },
    },
  },
};
