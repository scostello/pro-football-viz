import { asNexusMethod } from 'nexus';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

const GQLDate = asNexusMethod(GraphQLDate, "date");
const GQLDateTime = asNexusMethod(GraphQLDateTime, "datetime");
const GQLTime = asNexusMethod(GraphQLTime, "time");

export {
  GQLDate,
  GQLDateTime,
  GQLTime,
};
