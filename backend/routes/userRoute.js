import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
    loginUser,
    signupUser,
    changeAvatar,
    changePassword,
    getUserById,
    changeInfo,
} from '../controllers/userController.js';
const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// requre auth
router.use(requireAuth);

// profile of user
router.get('/profile', getUserById);

// change avatar
router.post('/change-avatar', changeAvatar);

// change password
router.patch('/change-password', changePassword);

// change info
router.patch('/change-info', changeInfo);

export default router;
