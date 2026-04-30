import {
    createInvite,
    listInvites,
    updateInviteStatus,
} from '../services/inviteService.js';

const sendError = (res, error, fallbackStatus) =>
    res.status(error.status || fallbackStatus).json({
        error: error.message,
        ...(error.emptyFields ? { emptyFields: error.emptyFields } : {}),
        ...(error.inviteId ? { inviteId: error.inviteId } : {}),
    });

const getInvites = async (req, res) => {
    try {
        const invites = await listInvites(req.user._id);
        return res.status(200).json(invites);
    } catch (error) {
        return sendError(res, error, 400);
    }
};

const sendInvite = async (req, res) => {
    try {
        const invite = await createInvite(req.body, req.user._id);
        return res.status(200).json(invite);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ error: 'Already sent invite to this user.' });
        }
        return sendError(res, error, 400);
    }
};

const respondInvite = async (req, res) => {
    try {
        const inviteId = req.body.inviteId || req.params.id;
        const invite = await updateInviteStatus(
            inviteId,
            req.body.status,
            req.user._id,
        );
        return res.status(200).json(invite);
    } catch (error) {
        return sendError(res, error, 400);
    }
};

export { getInvites, sendInvite, respondInvite };
