import env from './environment.js';

const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
};

export default corsOptions;
