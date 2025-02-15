const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '30d' });
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw Error('Please fill in all the required fields.');
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw Error('Wrong email or password.');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw Error('Wrong email or password.');
        }
        // create token
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// signup user
const signupUser = async (req, res) => {
    const { email, name, password, confirmPassword } = req.body;
    try {
        const baseAvatar =
            'https://cdn.iconscout.com/icon/free/png-256/free-user-icon-download-in-svg-png-gif-file-formats--avatar-person-profile-ui-basic-pack-interface-icons-2082543.png';
        if (!email || !name || !password || !confirmPassword) {
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
        const exists = await User.findOne({ email });
        if (exists) {
            throw Error('Email already exists.');
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            name,
            password: hash,
            avatar: baseAvatar,
        });
        // create token
        const token = createToken(user._id);
        res.status(200).json({ email, name, token, baseAvatar });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get User by Id
const getUserById = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json(user);
};

// change avatar
const changeAvatar = async (req, res) => {
    const { image } = req.body;
};

// change password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
};

module.exports = {
    loginUser,
    signupUser,
    getUserById,
    changeAvatar,
    changePassword,
};
