import Knex from 'knex';
import { RequestInfo, Response } from 'node-fetch';
import * as RA from 'ramda-adjunct';
import { ILogger } from 'stoolie';
import snakecase from 'lodash.snakecase';

type SyncParams = {
  logger: ILogger;
  dbCxn: Knex;
  fetch: (url: RequestInfo) => Promise<Response>;
};

const toSnakeCase = RA.renameKeysWith(snakecase);

const sync = async ({ logger, dbCxn, fetch }: SyncParams) => {
  const response = await fetch(
    'https://api.sportsdata.io/v3/nfl/scores/json/Timeframes/all',
  );
  const timeframes = await response.json();

  logger.info(`Received ${timeframes.length} timeframes.`);

  const records = timeframes.map(timeframe => toSnakeCase(timeframe));

  logger
    .withFields({
      before: timeframes[0],
      after: records[0],
    })
    .info('After conversion');

  await dbCxn.batchInsert(`sportdata_nfl.timeframes`, records);
};

export default sync;
