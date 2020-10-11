import Fs from 'fs';
import * as Knex from 'knex';
import S3 from 'aws-sdk/clients/s3';
import etl from 'etl';
import extract from 'extract-zip';
import csv from 'csv-parser';
import { ILogger } from 'stoolie';
import { getMapper } from './mappers';

const entryNames = [
  'BLOCK.csv',
  'CHART.csv',
  'CONV.csv',
  'DEFENSE.csv',
  'DRIVE.csv',
  'FGXP.csv',
  'FUMBLE.csv',
  'GAME.csv',
  'INJURY.csv',
  'INTERCPT.csv',
  'KICKER.csv',
  'KOFF.csv',
  'OFFENSE.csv',
  'PASS.csv',
  'PBP.csv',
  'PENALTY.csv',
  'PLAY.csv',
  'PLAYER.csv',
  'PUNT.csv',
  'REDZONE.csv',
  'RUSH.csv',
  'SACK.csv',
  'SAFETY.csv',
  'SCHEDULE.csv',
  'SNAP.csv',
  'TACKLE.csv',
  'TD.csv',
];

type LoadParams = {
  logger: ILogger;
  dbCxn: Knex;
};

const loadWith = async ({ logger, dbCxn }: LoadParams) => {
  const s3Client = new S3();

  const sourceConfigs = {
    Bucket: 'nfl-data',
    Key: 'armchair-analysis/nfl_00-19.zip',
  };

  const entry = logger.withFields({
    sourceType: 'S3 ReadStream',
    sourceConfigs,
  });

  entry.info('Attempt to download data from source');

  await new Promise((resolve, reject) => {
    s3Client
      .getObject(sourceConfigs)
      .createReadStream()
      .pipe(Fs.createWriteStream('/tmp/nfl_00-19.zip'))
      .on('finish', () => {
        resolve();
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });

  await extract('/tmp/nfl_00-19.zip', { dir: '/tmp/nfl_00-19' });

  await Promise.all(entryNames.map(entryName => {
    return new Promise((resolve, reject) => {
      const logEntry = entry.withFields({
        name: entryName,
      });

      const mapper = getMapper(entryName);

      logEntry.info('Extracting content');
      Fs.createReadStream(`/tmp/nfl_00-19/${entryName}`)
        .pipe(csv({
          mapHeaders: mapper.mapHeaders.bind(mapper),
          mapValues: mapper.mapValues.bind(mapper),
        }))
        .pipe(etl.collect(mapper.batchSize, 250))
        .pipe(
          etl.map(records => {
            return dbCxn.batchInsert(
              `armchair_analysis_2020.${mapper.tableName}`,
              records,
            );
          }),
        )
        .on('data', (data) => {
          logEntry.withFields(data).info('Inserted data');
        })
        .on('finish', () => {
          logEntry.info('Finished loading data.');
          resolve();
        })
        .on('error', err => {
          logEntry
            .withError(err)
            .error('An error occured during data loading');
          reject(err);
        });
    });
  }));
};

export default loadWith;
