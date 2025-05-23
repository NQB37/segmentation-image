const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();
const {
    getInvites,
    sendInvite,
    respondInvite,
} = require('../controllers/inviteController');

// requre auth for all routes
router.use(requireAuth);

// get all invites
router.get('/', getInvites);

// Send invite
router.post('/invite', sendInvite);

// Respond to invite
router.post('/invite/:id', respondInvite);

module.exports = router;
