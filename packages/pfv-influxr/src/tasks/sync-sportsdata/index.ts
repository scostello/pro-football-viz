import Path from 'path';
import Knex from 'knex';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { ILogger } from 'stoolie';
import sync from './sync';

const config = {
  db: {
    host: process.env.PG_DB_HOST || 'db.minikube.test',
    port: Number(process.env.PG_DB_PORT || 30543),
    database: process.env.PG_DB_NAME || 'postgres',
    user: process.env.PG_USER_NAME || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
  },
  api: {
    key: process.env.API_SPORTDATA_NFL_KEY || '',
  },
};

/** Knex */
export const schemaName = 'sportdata_nfl';
const createDbConnection = () =>
  Knex({
    client: 'pg',
    connection: config.db,
    migrations: {
      directory: Path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations',
      schemaName,
    },
  });

type ProcessOptions = {
  process: () => Promise<any>;
  beforeMessage: string;
  afterMessage: string;
};

const processWrapper = (logger: ILogger) => async (
  processOptions: ProcessOptions,
): Promise<any> => {
  const { process, beforeMessage, afterMessage } = processOptions;

  logger.info(beforeMessage);
  const result = await process();
  logger.info(afterMessage);

  return result;
};

const fetchWith = (options: RequestInit) => (url: RequestInfo) =>
  fetch(url, options);

const execute = async (logger: ILogger) => {
  const entry = logger.withFields({
    schema: schemaName,
  });

  const runProcess = processWrapper(entry);

  const dbCxn = await runProcess({
    process: () => Promise.resolve(createDbConnection()),
    beforeMessage: 'Creating db connection',
    afterMessage: 'Successfully created db connection',
  });

  await runProcess({
    process: () =>
      Promise.resolve(dbCxn.schema.createSchemaIfNotExists(schemaName)),
    beforeMessage: 'Creating schema is not already exists',
    afterMessage: 'Successfully created schema if not already exists',
  });

  await runProcess({
    process: () => dbCxn.migrate.latest(),
    beforeMessage: 'Migrate to latest db schema',
    afterMessage: 'Successfully migrated to latest db schema',
  });

  await runProcess({
    process: () =>
      sync({
        logger: entry,
        dbCxn,
        fetch: fetchWith({
          headers: {
            'Ocp-Apim-Subscription-Key': config.api.key,
          },
        }),
      }),
    beforeMessage: 'Begin data syncing process',
    afterMessage: 'Successfully completed data syncing process',
  });

  await runProcess({
    process: () => dbCxn.destroy(),
    beforeMessage: 'Closing database connection',
    afterMessage: 'Successfully closed db connection',
  });
};

export default execute;
