import env from './config/environement.js';
import mongoose from 'mongoose';
import app from './app.js';
import dns from 'dns';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/userModel.js';
import { setSocketServer, userRoom } from './utils/socket.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = env.PORT;
const MONGO_URI = env.MONGO_URI;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication token missing.'));
    }

    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(_id).select('_id');
    if (!user) {
      return next(new Error('Request not authorized.'));
    }

    socket.userId = user._id.toString();
    return next();
  } catch (error) {
    console.log('socket auth error', error.message);
    return next(new Error('Request not authorized.'));
  }
});

io.on('connection', (socket) => {
  socket.join(userRoom(socket.userId));
});

setSocketServer(io);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}!!!`);
    });
    console.log('connect to mongo db successfully');
  })
  .catch((error) => {
    console.log(error);
  });
