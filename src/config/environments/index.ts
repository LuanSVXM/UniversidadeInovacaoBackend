import { environment as DEV_ENV } from './environment.dev';
import { environment as PROD_ENV } from './environment.prod';


 const getEnvironments = () => {
  const env = process.env.DEPLOY;
  switch (env) {
    case 'DEV': return DEV_ENV;
    case 'PROD': return PROD_ENV;
    default: return DEV_ENV;
  }
};


export default getEnvironments;