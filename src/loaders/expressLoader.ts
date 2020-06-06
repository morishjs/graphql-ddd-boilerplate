import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';

import { env } from 'env';
import cors, { CorsOptions } from 'cors';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    /**
     * We create a new express server instance.
     * We could have also use useExpressServer here to attach controllers to an existing express instance.
     */
    const whitelist = env.app.allowOrigins;
    const corsOption: CorsOptions = {
      credentials: true,
      origin: (origin, callback) => {
        if (origin === undefined || whitelist.indexOf(origin) !== -1) {
          callback(undefined, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
    };

    const expressApp: Application = createExpressServer({
      cors: corsOption,
      defaultErrorHandler: false,
      /**
       * We can add options about how routing-controllers should configure itself.
       * Here we specify what controllers should be registered in our express server.
       */
      middlewares: env.app.dirs.middlewares,
    });

    expressApp.options('*', cors(corsOption));

    expressApp.get('/', (req, res) => {
      res.status(200).send();
    });

    expressApp.get('/_ah/warmup', (req, res) => {
      res.status(200).send('pong');
    });

    // Run application to listen on given port
    if (!env.isTest) {
      const server = expressApp.listen(env.app.port);
      settings.setData('express_server', server);
    }

    // Here we can set the data for other loaders
    settings.setData('express_app', expressApp);
  }
};
