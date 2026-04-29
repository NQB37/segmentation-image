import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
const router = express.Router();
import {
    getInvites,
    sendInvite,
    respondInvite,
} from '../controllers/inviteController.js';

// requre auth for all routes
router.use(requireAuth);

// get all invites
router.get('/', getInvites);

// Send invite
router.post('/invite', sendInvite);

// Respond to invite
router.post('/invite/:id', respondInvite);

export default router;
