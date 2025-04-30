const env = require('./config/environement');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const boardsRoute = require('./routes/boardRoute');
const userRoute = require('./routes/userRoute');
const inviteRoute = require('./routes/inviteRoute');

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
