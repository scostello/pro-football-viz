// import Fs from 'fs';
import * as Knex from 'knex';
import S3 from 'aws-sdk/clients/s3';
import etl from 'etl';
import unzipper from 'unzipper';
import csv from 'csv-parser';
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

async function load(knex: Knex) {
  const s3Client = new S3();

  await s3Client.getObject({ Bucket: 'nfl-data', Key: 'armchair-analysis/nfl_00-19.zip' })
    .createReadStream()
    .pipe(unzipper.Parse())
    .pipe(etl.map((entry) => {
      console.log(`found ${entry.path}`);
      if (entryNames.some(entryName => entryName === entry.path)) {
        const mapper = getMapper(entry.path);
        console.log(`processing ${entry.path}`);

        return entry
          .pipe(csv(mapper))
          .pipe(etl.collect(mapper.batchSize, 250))
          .pipe(etl.map((records) => {
            return knex.batchInsert(`armchair_analysis_2020.${mapper.tableName}`, records);
          }))
          .promise();
      }

      return entry.autodrain().promise();
    }))
    .on('finish', () => {
      console.log('finished');
    })
    .on('error', (err) => {
      console.log('errored', err);
    })
    .on('data', () => {
      console.log('data\'s');
    })
    .promise();

}

export default load;
