import 'reflect-metadata';
import { Connection, createConnection, useContainer } from 'typeorm-plus';

import { env } from '../../src/env';
import { Container } from 'typedi';

declare type LoggerOptions =
  | boolean
  | 'all'
  | Array<'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration'>;

interface EntityMetaData {
  name: string;
  tableName: string;
}

export const createDatabaseConnection = async (): Promise<Connection> => {
  const connectionOptions = {
    type: env.db.type as any, // See createConnection options for valid types
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    logging: env.db.logging as LoggerOptions,
    entities: ['src/modules/**/infra/*.ts'],
    migrations: env.app.dirs.migrations,
    cli: {
      migrationsDir: env.app.dirs.migrationsDir,
    },
    multipleStatements: true,
  };

  useContainer(Container);
  return await createConnection(connectionOptions);
};

export const synchronizeDatabase = async (connection: Connection) => {
  await connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
  await connection.runMigrations();
};

export const closeDatabase = async (connection: Connection) => {
  await connection.close();
};

export const dropDatabase = async (connection: Connection) => {
  await connection.dropDatabase();
};

export const clearAll = async (connection: Connection) => {
  try {
    const entities = getEntities(connection);

    for (const entity of entities) {
      const repo = connection.getRepository(entity.name);
      const [result] = await connection.query(`
        SELECT EXISTS (
         SELECT 1
         FROM   information_schema.tables
         WHERE  table_name = '${entity.tableName}'
       );
      `);

      if (result.exists) {
        await repo.query(`
        TRUNCATE TABLE ${entity.tableName} CASCADE;
        `);
      }
    }
  } catch (e) {
    throw new Error(`ERROR: Cleaning test db: ${e}`);
  }
};

export function getEntities(connection: Connection): EntityMetaData[] {
  const entities = [];

  connection.entityMetadatas.forEach(e => {
    entities.push({ name: e.name, tableName: e.tableName });
  });

  return entities;
}
