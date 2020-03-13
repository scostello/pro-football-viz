import { Context as ApolloContext } from 'apollo-server-core';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import * as Rx from 'rxjs';
import { createGqlServer } from './create-gql-server';
import { createHttpServer } from './create-http-server';

interface ApiConfig {
  readonly schema: GraphQLSchema;
  readonly context: ApolloContext;
}

const createApi = (config: ApiConfig): Rx.Observable<Server> => {
  const { schema, context } = config;
  const app = express();
  const gqlServer = createGqlServer({
    schema,
    context
  });

  // tslint:disable-next-line:no-expression-statement
  gqlServer.applyMiddleware({ app });
  const httpServer = createHttpServer(app);

  // tslint:disable-next-line:no-expression-statement
  gqlServer.installSubscriptionHandlers(httpServer);

  return Rx.of(httpServer);
};

export { createApi };
