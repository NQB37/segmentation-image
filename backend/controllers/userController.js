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
    const baseAvatar =
        'https://cdn.iconscout.com/icon/free/png-256/free-user-icon-download-in-svg-png-gif-file-formats--avatar-person-profile-ui-basic-pack-interface-icons-2082543.png';
    try {
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
        res.status(200).json({ email, name, baseAvatar, token });
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
    try {
        const { image } = req.body;
        if (!image) {
            throw Error('Image is required.');
        }

        // check user valid
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw Error('User not found.');
        }

        // update password
        const newInfo = await User.findByIdAndUpdate(
            req.user?._id,
            {
                avatar: image,
            },
            { new: true },
        );

        res.status(200).json({
            message: 'Profile image updated successfully.',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// change password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw Error('Please fill in all the required fields.');
        }

        // check user valid
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw Error('User not found.');
        }

        // validate
        // compare current password with db password
        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password,
        );
        if (!validPassword) {
            throw Error('User not found.');
        }
        // check password match
        if (newPassword !== confirmPassword) {
            throw Error('Password is not match.');
        }
        // check strong password
        if (!validator.isStrongPassword(newPassword)) {
            throw Error('Password not strong enough.');
        }
        // hash new pass
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // update password
        const newInfo = await User.findByIdAndUpdate(
            req.user?._id,
            {
                password: hash,
            },
            { new: true },
        );
        res.status(200).json({ message: 'Change password success.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// change info
const changeInfo = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            throw Error('Please fill in all the required fields.');
        }

        // check user valid
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw Error('User not found.');
        }

        // update password
        const newInfo = await User.findByIdAndUpdate(
            req.user?._id,
            {
                name: name,
            },
            { new: true },
        );
        res.status(200).json({ message: 'Change infomation successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    signupUser,
    getUserById,
    changeAvatar,
    changePassword,
    changeInfo,
};
