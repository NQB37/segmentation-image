const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();
const { createInvite } = require('../controllers/inviteController');
// requre auth for all routes
router.use(requireAuth);
// Create all
router.post('/', createInvite);

module.exports = router;
