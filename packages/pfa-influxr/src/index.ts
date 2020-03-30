import program from 'commander';
import { loadAaData } from './jobs';

const init = async () => {
  program
    .command('load')
    .action(loadAaData);

  await program.parseAsync(process.argv);
};

init();
