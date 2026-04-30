import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

const baseAvatar =
    'https://cdn.iconscout.com/icon/free/png-256/free-user-icon-download-in-svg-png-gif-file-formats--avatar-person-profile-ui-basic-pack-interface-icons-2082543.png';

const createToken = (_id) =>
    jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '30d' });

const login = async ({ email, password }) => {
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

    const token = createToken(user._id);
    return { email, token };
};

const signup = async ({ email, name, password, confirmPassword }) => {
    if (!email || !name || !password || !confirmPassword) {
        throw Error('Please fill in all the required fields.');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.');
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

    const token = createToken(user._id);
    return { email, name, baseAvatar, token };
};

const getUserProfile = (userId) => User.findById(userId);

const updateAvatar = async (userId, image) => {
    if (!image) {
        throw Error('Image is required.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found.');
    }

    await User.findByIdAndUpdate(
        userId,
        {
            avatar: image,
        },
        { new: true },
    );

    return { message: 'Profile image updated successfully.' };
};

const updatePassword = async (
    userId,
    { currentPassword, newPassword, confirmPassword },
) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw Error('Please fill in all the required fields.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found.');
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
        throw Error('User not found.');
    }
    if (newPassword !== confirmPassword) {
        throw Error('Password is not match.');
    }
    if (!validator.isStrongPassword(newPassword)) {
        throw Error('Password not strong enough.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
        userId,
        {
            password: hash,
        },
        { new: true },
    );

    return { message: 'Change password success.' };
};

const updateInfo = async (userId, { name }) => {
    if (!name) {
        throw Error('Please fill in all the required fields.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found.');
    }

    await User.findByIdAndUpdate(
        userId,
        {
            name: name,
        },
        { new: true },
    );

    return { message: 'Change infomation successfully.' };
};

export {
    getUserProfile,
    login,
    signup,
    updateAvatar,
    updateInfo,
    updatePassword,
};
