import { Container } from 'typedi';
import redis from 'redis-mock';
import { configureLogger } from '../../utils/logger';
import { clearAll, closeDatabase, createDatabaseConnection, migrateDatabase } from '../../utils/database';
import { Connection } from 'typeorm-plus';

beforeAll(async () => {
  const connection = await createDatabaseConnection();

  await migrateDatabase(connection);
  Container.set('connection', connection);
});

beforeEach(async () => {
  const connection = Container.get<Connection>('connection');
  await clearAll(connection);
});

afterAll(async () => {
  const connection = Container.get<Connection>('connection');
  await closeDatabase(connection);
});

(async () => {
  configureLogger();

  jest.setTimeout(2 * 60 * 1000);

  const client = redis.createClient();
  Container.set('cache', client);
})();
