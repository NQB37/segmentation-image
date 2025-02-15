const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, required: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
