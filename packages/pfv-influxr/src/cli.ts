import program from 'commander';
import stoolie from 'stoolie';
import { loadAaData, syncSportsData } from './tasks';

const logger = stoolie('pfv-influxr');

const init = async () => {
  program
    .command('load')
    .action(async () => {
      await loadAaData(logger);
    });

  program.command('sync').action(async () => {
    await syncSportsData(logger);
  });

  await program.parseAsync(process.argv);
};

export { init };
