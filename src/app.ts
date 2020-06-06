import 'module-alias/register';
import { bootstrapMicroframework } from 'microframework-w3tec';
import 'reflect-metadata';
import { banner } from './lib/banner';
import { Logger } from './lib/logger';
import { expressLoader } from './loaders/expressLoader';
import { graphqlLoader } from './loaders/graphqlLoader';
import { iocLoader } from './loaders/iocLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { winstonLoader } from './loaders/winstonLoader';
import { redisLoader } from 'loaders/redisLoader';

const log = new Logger(__filename);

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    winstonLoader,
    iocLoader,
    typeormLoader,
    expressLoader,
    graphqlLoader,
    redisLoader,
  ],
})
  .then(() => {
    banner(log);
  })
  .catch(error => {
    log.error(error.stack);
    log.error('Application is crashed: ' + error);
  });
