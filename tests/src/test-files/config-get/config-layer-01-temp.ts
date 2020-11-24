export default {
  // For the goldenCRM platform
  goldenCRM: {
    // For all services
    _shared: {
      // For any environment
      _shared: {
        databases: {
          primaryDb: {
            _shared: {
              user: 'admindb',
              password: 'localdev',
              database: 'coredb',
              host: 'localhost',
              port: 5432,
            },
            read: {},
            write: {},
          },
        },
      },
      dev: {
        databases: {
          primaryDb: {
            port: 5460,
          },
        },
      },
      stage: {
        databases: {
          primaryDb: {
            password: 'set from parameter store',
          },
        },
      },
      prod: {
        databases: {
          primaryDb: {
            password: 'set from parameter store',
          },
        },
      },
    },
    userAPI: {
      _shared: {},
      dev: {},
      stage: {},
      prod: {},
    },
    invoiceAPI: {
      _shared: {},
      dev: {},
      stage: {},
      prod: {},
    },
  },
};
