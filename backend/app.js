import express from 'express';
import cors from 'cors';
import notificationRoute from './routes/notificationRoute.js';
import boardsRoute from './routes/boardRoute.js';
import userRoute from './routes/userRoute.js';
import inviteRoute from './routes/inviteRoute.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/boardRoute', boardsRoute);
app.use('/api/userRoute', userRoute);
app.use('/api/inviteRoute', inviteRoute);
app.use('/api/notificationRoute', notificationRoute);

export default app;
