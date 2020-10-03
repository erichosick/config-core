# config-core

[![GitHub license](https://img.shields.io/github/license/erichosick/config-core?style=flat)](https://github.com/erichosick/config-core/blob/master/LICENSE) ![npm](https://img.shields.io/npm/v/config-core) [![codecov](https://codecov.io/gh/erichosick/config-core/branch/master/graph/badge.svg)](https://codecov.io/gh/erichosick/config-core)

config-core is a feature-rich but straightforward multi-source hierarchical configuration and settings solution. Its features include:

- Very small footprint and core library has no dependencies
- Simple Loading of Configuration Logic
  - No strange edge cases or hard code config file names or file "load order." You decide which files to load and what order to load them in.
- Minimizing configuration value redundancy by sharing them across:
  - multiple platforms/company-wide.
  - shared across multiple compute instances: application, services, lambdas, etc.
  - shared across multiple environments.
- Multiple configuration sources: each one used multiple times:
  - EnvironmentSource (shell environment values) in this repository.
  - FileSource (.json, .js, and .ts) in this repository.
  - FileYamlSource (.yaml) in [config-source-yaml](TODO) repository. TODO: Maybe be part of this repo: monolith repository.
  - FileIniSource (.ini) in [config-source-ini](TODO) repository. TODO: Maybe be part of this repo: monolith repository.
  - SsmParamSource ([AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)) in [config-source-ssm-param](TODO).
  - RestApiSource (RESTful endpoints) in [config-source-restApi](TODO) repository. TODO: Maybe be part of this repo: monolith repository.
- To support legacy configuration files and sources and provide maximum flexibility, we support:
  - Using multiple configuration files: the order of precedence of configuration values is based on their loaded order.
  - Using different types of configuration files (.json, .js, .ts, .yaml, .ini, etc.)
- TODO: Components can register with config-core and notified when a change to a configuration.
  - For example, if Infrastructure's CI/CD process updates the location of a database host (or password) in SSM Parameter Store, the changed values are eventually updated in all instances using referencing the configuration allowing the service to update data values without cycling the server.
  - Updating an instances logging level in SSM Parameter Store will eventually update the logging level of that compute instance, allowing for improved logging for debugging.

## Example Usage

Setup your environment for `CONFIG_PLATFORM`, `CONFIG_COMPUTE` and `NODE_ENV`.

Example:

```bash
export CONFIG_PLATFORM='specialCrm' # product name
export CONFIG_COMPUTE='restApi' # service/compute/lambda name
export NODE_ENV='dev' # execution environment/instance (dev, stage, prod, etc.)
```

Create a configuration file `config.json` (this example uses json):

```json
// config.json
{
  "specialCrm": {
    "restApi": {
      "_shared": {
        "db": {
          "user": "admin"
        }
      },
      "dev": {
        "db": {
          "port": 3005,
          "host": "localhost"
        }
      },
      "stage": {
        "db": {
          "port": 5432,
          "host": "db.company.com"
        }
      }
    }
  }
}
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

  // Optionally load all shell environment variables.
  await config.addSource(new EnvironmentSource());

  // Config can live in multiple files and file types.
  await config.addSource(new FileSource(`./settings/config.json`));
  await config.addSource(new FileSource(`./settings/config.yaml`));

  // Good idea to configure logging as soon as possible.
  let logger = new winston.Logger();
  logger.config(config.get('logConfig'));

  // WARNING: Any logging configuration values in parameter store would
  // not be reflected in the logger. Usually recommended to load all
  // configuration sources before using config (but not necessary).
  await config.addSource(new SSMParameterStoreSource());

  if (config.env('dev')) {
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
- **NODE_ENV**: execution environment or instance. Examples are `dev`, `stage`, `prod`, `myenv`, etc.

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
