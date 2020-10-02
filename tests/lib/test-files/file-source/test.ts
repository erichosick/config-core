export const config = {
  // For all platforms/whole company
  _shared: {
    // For all compute instances
    _shared: {
      // For all environments
      _shared: {
        // The serviceContext.cloudPlatform is set as AWS for all platforms,
        // compute instances and environments.
        serviceContext: {
          cloudPlatform: 'AWS',
        },
      },
      // Except staging. All staging environments will have the following as
      // their company name.
      stage: {
        companyName: 'The Stage Company, Inc.',
      },
    },
  },
  // Platform: This is the bigapp product which contains 2 services.
  bigApp: {
    // Compute: The user API and restful service
    userAPI: {
      // Values shared between all environments in the bigApp
      _shared: {
        userType: 'user',
      },
      // Environment
      dev: {
        // Configuration
        userName: 'devUser',
        userTitle: 'devTitle',
      },
      // Environment
      stage: {
        userName: 'stageUser',
        userTitle: 'stageTitle',
      },
      // Environment
      prod: {
        userName: 'prodUser',
        userTitle: 'prodTitle',
      },
    },
    // Compute: The accounting API and restful service for orders, invoices, etc.
    accountingAPI: {
      _shared: {
        userType: 'accountant',
      },
      // Environment
      dev: {
        userName: 'devUser',
        userTitle: 'devTitle',
      },
      // Environment
      stage: {
        userName: 'stageUser',
        userTitle: 'stageTitle',
      },
      // Environment
      prod: {
        userName: 'prodUser',
        userTitle: 'prodTitle',
      },
    },
  },
  // Platform: Another product provided by your company
  smallApp: {
    // ...
  },
};
