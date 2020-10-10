import program from 'commander';
import stoolie from 'stoolie';
import { loadAaData } from './tasks';

const logger = stoolie('pfv-influxr');

const init = async () => {
  program
    .command('load')
    .action(async () => {
      await loadAaData(logger);
    });

  await program.parseAsync(process.argv);
};

export { init };
