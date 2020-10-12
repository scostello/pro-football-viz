import {
  ApolloServer,
  ApolloServerExpressConfig,
} from 'apollo-server-express';

interface GqlServerConfig extends Pick<ApolloServerExpressConfig, 'context' | 'schema'> {}

const createGqlServer = (config: GqlServerConfig): ApolloServer => {
  const { schema, context } = config;
  return new ApolloServer({ schema, context });
};

export { createGqlServer };
