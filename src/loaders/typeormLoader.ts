import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createConnection, getConnectionOptions } from 'typeorm-plus';

import { env } from '../env';
import _ from 'lodash';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const loadedConnectionOptions = await getConnectionOptions();

  const connectionOptions = Object.assign(loadedConnectionOptions, {
    type: env.db.type as any, // See createConnection options for valid types
    host: env.db.host,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    entities: env.app.dirs.entities,
    migrations: env.app.dirs.migrations,
  });

  let connection;

  if (env.db.socket) {
    connection = await createConnection(
      _.chain(connectionOptions)
        .updateWith('[extra][socketPath]', _.constant(env.db.socket.socketPath), Object)
        .value(),
    );
  } else {
    connection = await createConnection(connectionOptions);
  }

  if (settings) {
    settings.setData('connection', connection);
    settings.onShutdown(() => connection.close());
  }
};
