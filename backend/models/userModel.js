const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: { type: String, required: true },
        displayName: { type: String, required: false },
        avatar: { type: String, required: false },
    },
    { timestamps: true },
);

// static signup
userSchema.statics.signup = async function (email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
        throw Error('Please fill in all the required fields.');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough.');
    }
    if (password != confirmPassword) {
        throw Error('Password is not match.');
    }
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already exists.');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hash });
    return user;
};

// static login
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Please fill in all the required fields.');
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Wrong email or password.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Wrong email or password.');
    }
    return user;
};
module.exports = mongoose.model('User', userSchema);
