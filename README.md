# config-core

[![GitHub license](https://img.shields.io/github/license/erichosick/config-core?style=flat)](https://github.com/erichosick/config-core/blob/main/LICENSE) ![npm](https://img.shields.io/npm/v/config-core) [![codecov](https://codecov.io/gh/erichosick/config-core/branch/main/graph/badge.svg)](https://codecov.io/gh/erichosick/config-core)

config-core is a feature-rich but straightforward multi-source hierarchical configuration and settings solution.

- mix and match multiple configuration sources: [.yaml](https://www.github.com/erichosick/config-source-yaml), [.json, .ts](https://www.github.com/erichosick/config-core), [environment variables](https://www.github.com/erichosick/config-core), TODO [ini](), TODO [AWS Parameter Store]() (see [AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)), TODO [REST APIs]()
- Remove configuration redundancy by sharing configuration values between:
  - multiple platforms/company
  - shared across multiple compute instances: application, services, lambdas, etc.
  - shared across multiple environments
- Unopinionated loading order of Configuration sources: You decide which sources to load and what order to load them in.
- Support for legacy configuration files.
- Very small footprint

## Example Usage

- [Javascript Example](./examples/javascript/README.md) in `./examples/javascript`.
- [Typescript Example](./examples/typescript/README.md) in `./examples/typescript`.

Setup config environment: `CONFIG_PLATFORM`, `CONFIG_COMPUTE` and `NODE_ENV`.

Example:

```bash
# Minimum shell environment variable setting
export NODE_ENV='dev' # execution environment/instance (dev, stage, prod, etc.)
```

Place other environment variables in `_env` scope.

```json
// settings-env.json
{
  "_env": {
    "CONFIG_PLATFORM": "specialCrm",
    "CONFIG_COMPUTE": "restApi",
  },
};
```

Create a configuration file `config.ts` (this example uses typescript):

```typescript
// config.ts
export const settings = {
  specialCrm: {
    restApi: {
      _shared: {
        db: {
          user: 'admin',
        },
      },
      dev: {
        db: {
          port: 3005,
          host: 'localhost',
        },
      },
      stage: {
        db: {
          port: 5432,
          host: 'db.company.com',
        },
      },
    },
  },
};
```

and use a second file that happens to be a YAML `config.yaml`:

```yaml
// config.yaml
specialCrm:
  restApi:
    dev:
      db:
        port: 3008
```

Create an `app.ts` file and load all configuration sources as soon as possible:

```typescript
import { winston } from 'winston';
import { app } from './app';
import { config, EnvironmentSource, FileSource, SSMParameterStoreSource } from 'config-core';

(async () => {
  // Load all configuration sources in the correct order.
  // Configuration values in sources added later take
  // precedence over those loaded first.

  // config is a singleton pattern, but you can always use
  // `const config = new Config();` if the singleton pattern
  // isn't your thing.

  // Load all shell and file environment variables.
  await config.addSource(new EnvironmentSource());
  await config.addSource(new FileSource(`./settings/settings-env.json`));

  // Config can live in multiple files and file types.
  await config.addSource(new FileSource(`./settings/config.ts`));
  await config.addSource(new FileSource(`./settings/config.yaml`));

  // Good idea to configure logging as soon as possible.
  let logger = new winston.Logger();
  logger.config(config.get('logConfig'));

  // WARNING: Any logging configuration values in parameter store would
  // not be reflected in the logger. Usually recommended to load all
  // configuration sources before using config (but not necessary).
  await config.addSource(new SSMParameterStoreSource());

  if (config.env('NODE_ENV') === 'dev') {
    // Provide a place for developers to override configuration values
    await config.addSource(new FileSource(`./settings/dev-override.yaml`));
  }

  // Finally, start the application.
  await app.execute();
})();
```

Use the `config` singleton set up in your `app.ts` anywhere within your program:

```typescript
import { config } from 'config-core';

// config.get automatically scopes by platform, compute, and environment.
let dbConfig = config.get('db');

// NOTE:
//   * We get `user: 'admin'` because the db.user configuration
//      is shared across all defined environments.
//   * We get a `port: 3008` instead of `port: 3005` because
//     the YAML config was loaded after the JSON configuration
//     giving the configuration values in YAML precedence.

// prints { port: 3008, host: 'localhost', user: 'admin' }
console.log(dbConfig);

// You can ignore the auto scoping of `get` by using `getAbsolute`.
// However, you lose the auto merging of `_shared` properties.
let dbConfig2 = config.getAbsolute('specialCrm.restApi.dev.db');

// Note that `user` is missing, but the `port` value is still overridden
// because it is in another file and that absolute location.
// prints { port: 3008, host: "localhost" }
console.log(dbConfig2);

// get an environment variable.
const node_env = config.env('NODE_ENV');
console.log(`Current environment is ${node_env}`);
```

## Installation

Install `config-core` and optional configuration sources:

Using npm:

```bash
$ npm install --save config-core
$ npm install --save config-source-ssm-param # optionally use Parameter Store
$ npm install --save config-file-yaml # optionally use YAML files
```

Using yarn:

```bash
$ yarn add --save config-core
$ yarn add --save config-source-ssm-param # optionally use Parameter Store
$ yarn add --save config-file-yaml # optionally use YAML files
```

## Shell Environment Variables and Meaning

There are (currently) only three environment variables you should ever need to set for your application, service, lambda, etc.:

- **CONFIG_PLATFORM**: product or company name. Example `specialCrm`.
- **CONFIG_COMPUTE**: compute instance (service/app/lambda) name. Examples `restApi` are `authLambda`.
- **NODE_ENV**: execution environment or instance. Always a shell environment value. Examples are `dev`, `stage`, `prod`, `myenv`, etc.

It is recommended to always define `NODE_ENV` as an shell environment variable. `CONFIG_PLATFORM` and `CONFIG_COMPUTE` can be defined in a configuration file under the `_env` scope.

Example:

```json
// settings-env.json
{
  "_env": {
    "CONFIG_PLATFORM": "${platform_name}",
    "CONFIG_COMPUTE": "${compute_name}",
  },
};
```

## Configuration Values Context

Consider shell environment variable values as follow:

```bash
export CONFIG_PLATFORM='specialCrm' # scope by platform/product/company name
export CONFIG_COMPUTE='restApi' # scope by service/compute/lambda name
export NODE_ENV='dev' # scope by environment/instance
```

Configuration value context is based on a hierarchy of `platform.compute.env.config`.

The following is an example configuration file (`.ts` in this case, but other formats are supported).

Note that `_shared` is a reserved word and can be used as a `*` placeholder at any point in the context hierarchy of `platform`, `compute`, or `env`.

```typescript
// example-config.ts
// The root of the configuration file is scoped to your
// entire company: all software offerings.
export const config = {
  // _shared PLATFORM: Configuration values under "_shared" at the root are
  // shared across all platform/companies
  _shared: {
    // _shared COMPUTE: Configuration values under "_shared._shared" are
    // shared across all services, apps, lambdas, etc.
    _shared: {
      // _shared ENV: Configuration values under "_shared._shared._shared" are
      // shared across all environments
      _shared: {
        // configuration values here
      },
    },
  },
  // specialCrm (PLATFORM): Configuration values under the platform are
  // scoped to the specific platform's context. In this case, "specialCrm".
  specialCrm: {
    // _shared COMPUTE: Configuration values under "specialCrm._shared" are shared
    // across all services, apps, lambdas, etc. under the "specialCrm" platform.
    _shared: {
      // _shared ENV: Configuration values under "specialCrm._shared._shared" are
      // shared across all environments
      _shared: {
        // configuration values here
      },
      // _shared dev (ENV): Configuration values under "specialCrm._shared.dev"
      // are shared across all compute instances dev environment.
      dev: {
        // configuration values here
      },
    },
    // restApi COMPUTE: Configuration values under "specialCrm.restApi" are shared
    // for a specific platform. In this case "restApi".
    rest_api: {
      // ENV: Configuration values under "specialCrm.restApi._shared" are
      // shared across all environments within the context of specialCrm
      // and restApi
      _shared: {
        // configuration values here
      },
      // dev ENV: Configuration values under "specialCrm.restApi.dev" are
      // specific for that platoform, compute and environment.
      dev: {
        // configuration values here
      },
    },
  },
};
```

### Example Usage

```typescript
export const config = {
  // PLATFORM: For all platforms/whole company
  _shared: {
    // COMPUTE: For all compute instances
    _shared: {
      // ENV: For all environments
      _shared: {
        // The serviceContext.cloudPlatform is set as AWS for all platforms,
        // compute instances and environments.
        serviceContext: {
          cloudPlatform: 'AWS',
        },
        company: {
          name: 'The Big Company, Inc.',
          address: {
            line01: '115 Nice Road, Dr.',
            city: 'Santa Cruz',
            state: 'CA',
            zip: '95060',
          },
        },
      },
      // Except dev which overrides and uses the following
      // serviceContext.cloudPlatform and company.name
      dev: {
        serviceContext: {
          cloudPlatform: 'Local',
        },
        company: {
          name: 'The Dev Company, Inc.',
        },
      },
    },
  },
  // PLATFORM: This is the bigapp product which contains 2 services.
  specialCrm: {
    // COMPUTE: The user API and restful service
    restApi: {
      // Config values for restApi
    },
  },
};
```

**NOTE**: It is highly unlikely a single configuration file would contain
multiple platforms. However, sources (such as AWS Parameter Store) might contain
multiple platforms and compute.
