const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();
const {
    sendInvite,
    respondInvite,
} = require('../controllers/inviteController');
// requre auth for all routes
router.use(requireAuth);

// Send invite
router.post('/invite', sendInvite);

// Respond to invite
router.post('/invite/respond', respondInvite);

module.exports = router;
