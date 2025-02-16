require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_PORT: process.env.APP_PORT,
};
