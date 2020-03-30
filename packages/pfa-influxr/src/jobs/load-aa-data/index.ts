import Path from 'path';
import Knex from 'knex';
import load from './load';

const config = {
  db: {
    host: process.env.PG_DB_HOST || 'db.minikube.test',
    port: Number(process.env.PG_DB_PORT || 30543),
    database: process.env.PG_DB_NAME || 'postgres',
    user: process.env.PG_USER_NAME || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
  },
};

/** Knex */
export const schemaName = 'armchair_analysis';
const knex = Knex({
  client: 'pg',
  connection: config.db,
  migrations: {
    directory: Path.resolve(__dirname, 'migrations'),
    tableName: 'knex_migrations',
    schemaName,
  },
});

const execute = async () => {
  await knex.schema.createSchemaIfNotExists(schemaName);
  await knex.migrate.latest();
  await load(knex);
  console.log('closing connection');
  await knex.destroy();
};

export default execute;
