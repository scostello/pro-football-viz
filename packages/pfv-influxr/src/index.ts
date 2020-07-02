import program from 'commander';
import { loadAaData } from './tasks';

const init = async () => {
  program
    .command('load')
    .action(loadAaData);

  await program.parseAsync(process.argv);
};

init();
