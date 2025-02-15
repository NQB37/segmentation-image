const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const {
    loginUser,
    signupUser,
    changeAvatar,
    changePassword,
    getUserById,
} = require('../controllers/userController');
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
router.patch('/change-avatar', changePassword);

module.exports = router;
