export const settings = {
  _shared: {
    _shared: {
      _shared: {
        // database configuration is shared across all
        // platforms, products and environments.
        databases: {
          userDb: {
            write: {
              database: 'userdb',
              host: 'localhost',
              port: 5432,
              user: 'admin',
              // password: ${from parameter store},
              idleTimeoutMillis: 1000,
              connectionTimeoutMillis: 1000,
              min: 4, // minimum pool size
              max: 20, // maximum pool size
              ssl: false,
            },
          },
        },
        dev: {
          databases: {
            userDb: {
              write: {
                // locally, port may need to run on
                // a different port
                port: 3009,
                // ok to commit local dev password
                password: 'dev-password',
              },
            },
          },
        },
        stage: {
          databases: {
            userDb: {
              write: {
                // maybe part of parameter store
                host: 'userdb-stage.company.com',
              },
            },
          },
        },
        prod: {
          databases: {
            userDb: {
              write: {
                // maybe part of parameter store
                host: 'userdb-prod.company.com',
              },
            },
          },
        },
      },
    },
  },
  specialCrm: {
    restApi: {
      _shared: {
        service: {
          name: 'Special CRM Rest API',
          port: 443,
        },
        logging: {
          fileName: 'combined.log',
          level: 'debug',
        },
      },
      dev: {
        service: {
          port: 3010,
        },
        logging: {
          level: 'info',
        },
      },
    },
  },
};
