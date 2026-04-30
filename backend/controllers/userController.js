import {
    getUserProfile,
    login,
    signup,
    updateAvatar,
    updateInfo,
    updatePassword,
} from '../services/userService.js';

const loginUser = async (req, res) => {
    try {
        const result = await login(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    try {
        const result = await signup(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const user = await getUserProfile(req.user._id);
    return res.status(200).json(user);
};

const changeAvatar = async (req, res) => {
    try {
        const result = await updateAvatar(req.user?._id, req.body.image);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const result = await updatePassword(req.user?._id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const changeInfo = async (req, res) => {
    try {
        const result = await updateInfo(req.user?._id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export {
    loginUser,
    signupUser,
    getUserById,
    changeAvatar,
    changePassword,
    changeInfo,
};
