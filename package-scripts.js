/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps start',
    /**
     * Starts the builded app from the dist directory.
     */
    start: {
      script: series('node dist/app.js'),
      description: 'Starts the builded app',
    },
    /**
     * Setup of the development environment
     */
    setup: {
      script: series('yarn install', 'nps db.setup'),
      description: 'Setup`s the development environment(yarn & database)',
    },
    /**
     * Creates the needed configuration files
     */
    config: {
      script: series(runFast('./commands/tsconfig.ts')),
      hiddenFromHelp: true,
    },
    /**
     * Builds the app into the dist directory
     */
    build: {
      script: series(
        'nps banner.build',
        'nps config',
        'nps clean.dist',
        'nps transpile',
        'nps copy',
        'nps copy.tmp',
        'nps clean.tmp',
      ),
      description: 'Builds the app into the dist directory',
    },
    /**
     * Transpile your app into javascript
     */
    transpile: {
      script: `tsc --project ./tsconfig.build.json`,
      hiddenFromHelp: true,
    },
    /**
     * Clean files and folders
     */
    clean: {
      default: {
        script: series(`nps banner.clean`, `nps clean.dist`),
        description: 'Deletes the ./dist folder',
      },
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true,
      },
      tmp: {
        script: rimraf('./.tmp'),
        hiddenFromHelp: true,
      },
    },
    /**
     * Copies static files to the build folder
     */
    copy: {
      default: {
        script: series(`nps copy.public`),
        hiddenFromHelp: true,
      },
      public: {
        script: copy('./src/public/*', './dist'),
        hiddenFromHelp: true,
      },
      tmp: {
        script: copyDir('./.tmp/src', './dist'),
        hiddenFromHelp: true,
      },
    },
    decrypt: {
      develop: {
        script: `
                    gcloud kms decrypt \\
                    --plaintext-file=env/.env.develop \\
                    --ciphertext-file=env/.env.develop.enc \\
                    --location=global \\
                    --keyring=develop \\
                    --project=selectchu-dev \\
                    --key=sc-api
                  `,
      },
      production: {
        script: `
                    gcloud kms decrypt \\
                    --plaintext-file=env/.env.production \\
                    --ciphertext-file=env/.env.production.enc \\
                    --location=global \\
                    --project=selectchu-prod-253306 \\
                    --keyring=selectchu \\
                    --key=ss-backend
                 `,
      },
    },
    /**
     * Database scripts
     */
    db: {
      migrate: {
        script: series(
          'nps banner.migrate',
          runFast('-r tsconfig-paths/register ./node_modules/typeorm-plus/cli.js migration:run'),
        ),
        description: 'Migrates the database to newest version available',
      },
      'migrate:production': {
        script: series('nps decrypt.production', 'nps db.migrate'),
      },
      revert: {
        script: series(
          'nps banner.revert',
          'nps config',
          runFast('-r tsconfig-paths/register ./node_modules/typeorm-plus/cli.js migration:revert'),
        ),
        description: 'Downgrades the database',
      },
      seed: {
        script: series('nps banner.seed', 'nps config', runFast('./commands/seed.ts')),
        description: 'Seeds generated records into the database',
      },
      drop: {
        script: runFast('./node_modules/typeorm-plus/cli.js schema:drop'),
        description: 'Drops the schema of the database',
      },
      setup: {
        script: series('nps db.drop', 'nps db.migrate'),
        description: 'Recreates the database',
      },
    },
    ci: {
      pretest: {
        default: {
          script: series('cp env/.env.test .env', 'NODE_ENV=test nps db.migrate'),
        },
      },
    },

    /**
     * These run various kinds of tests. Default is unit.
     */
    test: {
      default: 'nps test.unit',
      unit: {
        default: {
          script: series('nps banner.testUnit', 'nps test.unit.run'),
          description: 'Runs the unit tests',
        },
        run: {
          script: series('NODE_ENV=test jest --config jest.config.js --runInBand --forceExit'),
          hiddenFromHelp: true,
        },
        verbose: {
          script: 'nps "test --verbose"',
          hiddenFromHelp: true,
        },
        coverage: {
          script: 'nps "test --coverage"',
          hiddenFromHelp: true,
        },
      },
    },
    /**
     * This creates pretty banner to the terminal
     */
    banner: {
      build: banner('build'),
      serve: banner('serve'),
      testUnit: banner('test.unit'),
      testIntegration: banner('test.integration'),
      testE2E: banner('test.e2e'),
      migrate: banner('migrate'),
      seed: banner('seed'),
      revert: banner('revert'),
      clean: banner('clean'),
    },
  },
};

function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: runFast(`./commands/banner.ts ${name}`),
  };
}

function copy(source, target) {
  return `copyfiles --up 1 ${source} ${target}`;
}

function copyDir(source, target) {
  return `ncp ${source} ${target}`;
}

function runFast(path) {
  return `ts-node --transpile-only ${path}`;
}
