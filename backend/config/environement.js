import dotenv from 'dotenv';

// const envPath =
//   process.env.NODE_ENV === 'development' ? '.env' : '.env.production';

// dotenv.config({ path: envPath });
dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  PORT: process.env.PORT,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
};
