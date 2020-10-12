import { createApi } from './infra';
import { createContext } from './gql-context';
import { createSchema } from './gql-schema';

type ServiceConfig = {
  protocol: string;
  host: string;
  port: number | string;
};

const config: ServiceConfig = {
  protocol: process.env.API_PROTOCOL || 'http',
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 4000
};

const init = (listenCallback: (ServiceConfig) => void) => {
  const context = createContext();
  const schema = createSchema();

  createApi({ schema, context })
    .subscribe(api => api.listen(config, () => listenCallback(config)))
};

export { init };
