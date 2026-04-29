import env from './config/environement.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import boardsRoute from './routes/boardRoute.js';
import userRoute from './routes/userRoute.js';
import inviteRoute from './routes/inviteRoute.js';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

//express app
const app = express();
const APP_PORT = env.APP_PORT;
const MONGO_URI = env.MONGO_URI;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
// middlewares
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/boardRoute', boardsRoute);
app.use('/api/userRoute', userRoute);
app.use('/api/inviteRoute', inviteRoute);

// connect to db
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
