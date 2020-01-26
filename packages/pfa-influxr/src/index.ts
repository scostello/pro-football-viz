import program from 'commander';
import { generate, provision } from './sql-builder';

const init = () => {
  program
    .command('build')
    .description('Build the SQL files for our project.')
    .action(generate);

  program
    .command('provision')
    .description('Provision a database for our project.')
    .action(provision);

  program.parse(process.argv);
};

init();
