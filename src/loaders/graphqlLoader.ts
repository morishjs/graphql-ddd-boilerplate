import bodyParser from 'body-parser';
import * as express from 'express';
import GraphQLHTTP from 'express-graphql';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { env } from 'env';
import { getErrorCode, getErrorMessage, handlingErrors } from 'lib/graphql';
import _ from 'lodash';
import { Context } from 'api/Context';
import * as uuid from 'uuid';
import cookieParser from 'cookie-parser';

export const graphqlLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  if (settings && env.graphql.enabled) {
    const expressApp = settings.getData('express_app');

    const schemaOptions = {
      resolvers: env.app.dirs.resolvers,
      // automatically create `schema.gql` file with schema definition in current folder
      container: Container,
    };

    if (env.isLocal) {
      _.set(schemaOptions, 'emitSchemaFile', path.resolve(__dirname, '../api', 'schema.gql'));
    }

    const schema = await buildSchema(schemaOptions);

    handlingErrors(schema);

    // Add graphql layer to the express app
    expressApp.use(bodyParser.json({ limit: '50mb' }));
    expressApp.use(cookieParser());
    expressApp.use(env.graphql.route, async (request: express.Request, response: express.Response) => {
      // Build GraphQLContext
      const context = getContext(request, response);
      context.container.set('context', context); // place context or other data in container

      // Setup GraphQL Server
      GraphQLHTTP({
        schema,
        context,
        pretty: true,
        graphiql: env.graphql.editor,
        customFormatErrorFn: error => {
          return {
            extensions: {
              code: getErrorCode(error.message),
            },
            message: getErrorMessage(error.message),
            path: error.path,
          };
        },
      })(request, response);
    });
  }
};

function getContext(request: express.Request, response: express.Response): Context {
  const container = Container.of(uuid.v4());
  if (request.headers.authorization) {
    const token = request.headers.authorization.split('Bearer ')[1];
    if (token) {
      const parsed = JSON.parse(token);

      if (!_.isEmpty(parsed)) {
        container.set('token', JSON.parse(token));
      }
    }
  }
  return { container, request, response }; // create our context
}
