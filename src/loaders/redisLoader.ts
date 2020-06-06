import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import Redis from 'ioredis';
import { env } from 'env';
import { Container } from 'typedi';
import { Logger } from 'lib/logger';

export const redisLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger();
  const redisClient = new Redis({
    port: env.redis.port,
    host: env.redis.host,
    family: 4,
    password: env.redis.password,
  });

  redisClient.on('error', err => {
    log.error(`Error occurs: ${err}`);
  });

  Container.set('cache', redisClient);

  if (settings) {
    settings.onShutdown(() => {
      redisClient.quit();
    });
  }
};
