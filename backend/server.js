import env from './config/environement.js';
import mongoose from 'mongoose';
import app from './app.js';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const APP_PORT = env.APP_PORT;
const MONGO_URI = env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(APP_PORT, () => {
      console.log(`listening on port ${APP_PORT}!!!`);
    });
    console.log('connect to mongo db successfully');
  })
  .catch((error) => {
    console.log(error);
  });
