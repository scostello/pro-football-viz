import { makeSchema } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { CollegeProgram, GQLDate, GQLDateTime, GQLTime, Person, PersonName } from './domain/common';
import { Player, PlayerMeasurable } from './domain/players';
import { Coach } from './domain/coaches';
import { Executive } from './domain/executives';

// changes!!
const createSchema = () => makeSchema({
  types: [
    GQLDate,
    GQLDateTime,
    GQLTime,
    PersonName,
    Person,
    Player,
    PlayerMeasurable,
    CollegeProgram,
    Coach,
    Executive,
  ],
  plugins: [nexusSchemaPrisma({
    outputs: {
      typegen: `${__dirname}/generated/nexus-prisma.gen.ts`,
    },
  })],
  outputs: {
    schema: `${__dirname}/generated/schema.gen.graphql`,
    typegen: `${__dirname}/generated/nexus.gen.ts`,
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./gql-context'),
        alias: 'Context',
      }
    ],
  },
});

export { createSchema };

export default createSchema();
