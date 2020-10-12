import { init } from './init';

init(config => {
  console.log(`Ssserver started at ${config.protocol}://${config.host}:${config.port} 🔥🔥`);
});
