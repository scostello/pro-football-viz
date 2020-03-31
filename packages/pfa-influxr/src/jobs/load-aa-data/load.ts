import Fs from 'fs';
import * as Knex from 'knex';
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
];

async function load(knex: Knex) {
  await new Promise((resolve, reject) => {
    Fs.createReadStream('./nfl-test.zip')
    .pipe(unzipper.Parse())
    .pipe(etl.map(5, (entry) => {
      if (entryNames.some(entryName => entryName === entry.path)) {
        const mapper = getMapper(entry.path);
        return entry
          .pipe(csv(mapper))
          .pipe(etl.collect(mapper.batchSize))
          .pipe(etl.map((records) => {
            knex.batchInsert(`armchair_analysis.${mapper.tableName}`, records);
          }));
      }

      entry.autodrain();
    }))
    .on('finish', () => {
      console.log('finished');
      resolve();
    })
    .on('error', (err) => {
      console.log('error');
      reject(err);
    });
  })  
}

export default load;
