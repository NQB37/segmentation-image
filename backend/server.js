require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const boardsRoute = require('./routes/boardsRoute');
const userRoute = require('./routes/userRoute');

//express app
const app = express();
const PORT_NUM = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
// middlewares
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/boardsRoute', boardsRoute);
app.use('/api/userRoute', userRoute);

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT_NUM, () => {
            console.log(`listening on port ${PORT_NUM}!!!`);
        });
        console.log('connect to mongo db successfully');
    })
    .catch((error) => {
        console.log(error);
    });

// listen for requests
