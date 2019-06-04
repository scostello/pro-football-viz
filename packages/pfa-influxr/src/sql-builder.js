import path from 'path';
import fs from 'fs';
import { Client } from 'pg';
import glob from 'glob';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../.env') });

const buildPath = path.join(__dirname, '../build');

const sqlPath = path.join(__dirname, './sql/02-reporting');
const sqlGlob = '**/*.sql';
const sqlGlobPath = path.join(sqlPath, sqlGlob);

const concatFiles = files => new Promise((resolve) => {
  const contents = files
    .map(file => fs.readFileSync(file, { encoding: 'utf-8' }))
    .reduce((acc, file) => acc.concat([file]), [])
    .join('\r\n');

  return resolve(contents);
});

const createBuildDir = buildDir => new Promise((resolve, reject) => {
  if (fs.existsSync(buildDir)) return resolve(buildDir);

  fs.mkdir(buildDir, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve(buildDir);
  });
});

const writeFile = (fileName, contents) => () => new Promise((resolve, reject) => {
  fs.writeFile(fileName, contents, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve(contents);
  });
});

const writeContentsTo = filePath => contents => createBuildDir(path.dirname(filePath))
  .then(writeFile(filePath, contents));

export const generate = () => concatFiles(glob.sync(sqlGlobPath))
  .then(writeContentsTo(path.join(buildPath, 'pro_football_analytics.sql')));

const connect = () => new Promise((resolve) => {
  const client = new Client();
  client.connect();
  return resolve(client);
});

const runSql = ([sql, client]) => new Promise((resolve, reject) => {
  client.query(sql, (err, res) => {
    if (err) return reject(err);

    client.end();
    return resolve(res);
  });
});

export const provision = () => Promise.all([generate(), connect()])
  .then(runSql)
  .catch(err => console.error(err));
