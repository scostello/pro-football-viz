import fs from 'fs';
import etl from 'etl';
import program from 'commander';
import unzipper from 'unzipper';
import csv from 'csv-parser';
import { headers } from './jobs/load-aa-data';
// import { pathToFileURL } from 'url';
// import S3 from 'aws-sdk/clients/s3';
// import { generate } from './sql-builder';

const init = async () => {
  program
    .command('build-csv')
    .action(run);

  // program
  //   .command('build-sql')
  //   .description('Build the SQL files for our project.')
  //   .action(generate);

  await program.parseAsync(process.argv);
};

async function run() {
  // const s3Client = new S3({ apiVersion: '2006-03-01' });

  // s3Client.getObject({
  //   Bucket: 'nfl-data',
  //   Key: 'nfl_19.zip',
  // })
  //   .createReadStream()
  await fs.createReadStream('./nfl-test.zip')
    .pipe(unzipper.Parse())
    .pipe(etl.map((entry) => {
      const headerMap = headers[entry.path];
      entry
        .pipe(csv({
          mapHeaders: ({ header }) => headerMap[header],
        }))
        .pipe(etl.stringify())
        .pipe(etl.toFile(`./converted/${entry.path}`));
    }));
}

init();
