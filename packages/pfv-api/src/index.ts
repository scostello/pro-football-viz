import { init } from './init';

init(config => {
  console.log(`Server started at ${config.protocol}://${config.host}:${config.port} 🔥🔥`);
});
