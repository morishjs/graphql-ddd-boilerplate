import * as dotenv from 'dotenv';
import * as path from 'path';
import _ from 'lodash';
import * as pkg from '../package.json';
import {
  getOsEnv,
  getOsEnvArray,
  getOsEnvOptional,
  getOsPath,
  getOsPaths,
  normalizePort,
  toBool,
  toNumber,
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  isLocal: process.env.NODE_ENV === 'local',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
    allowOrigins: getOsEnvArray('APP_ALLOW_ORIGINS'),
    timezone: getOsEnvOptional('TIMEZONE') || 'Asia/Seoul',
    dirs: {
      migrations: getOsPaths('TYPEORM_MIGRATIONS'),
      migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
      entities: getOsPaths('TYPEORM_ENTITIES'),
      middlewares: getOsPaths('MIDDLEWARES'),
      subscribers: getOsPaths('SUBSCRIBERS'),
      resolvers: getOsPaths('RESOLVERS'),
    },
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT'),
  },
  db: {
    type: getOsEnv('TYPEORM_CONNECTION'),
    host: getOsEnvOptional('TYPEORM_HOST'),
    port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
    username: getOsEnvOptional('TYPEORM_USERNAME'),
    password: getOsEnvOptional('TYPEORM_PASSWORD'),
    database: getOsEnv('TYPEORM_DATABASE'),
    synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE')),
    logging: _.compact([getOsEnv('TYPEORM_LOGGING'), getOsEnvOptional('TYPEORM_LOGGING_ENABLE_QUERY')]),
    socket: getOsEnvOptional('TYPEORM_DRIVER_EXTRA') && JSON.parse(getOsEnvOptional('TYPEORM_DRIVER_EXTRA')),
  },
  graphql: {
    enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
    route: getOsEnv('GRAPHQL_ROUTE'),
    editor: toBool(getOsEnv('GRAPHQL_EDITOR')),
  },
  imageUploadProvider: {
    service: getOsEnv('IMAGE_PROVIDER'),
    google: {
      bucketName: getOsEnvOptional('GOOGLE_STORAGE_BUCKET_NAME'),
    },
    local: {
      imageDirPath: getOsEnv('LOCAL_IMAGE_DIR_PATH'),
    },
  },
  redis: {
    host: getOsEnvOptional('REDIS_HOST'),
    port: toNumber(getOsEnvOptional('REDIS_PORT')) || 6379,
    password: getOsEnvOptional('REDIS_PASSWORD'),
  },
  auth: {
    tokenExpiryTime: getOsEnv('AUTH_TOKEN_EXPIRY_TIME'),
    secret: getOsEnv('AUTH_SECRET'),
  },
};
