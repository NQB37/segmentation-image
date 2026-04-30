import env from './environement.js';

const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
};

export default corsOptions;
