const Invite = require('../models/inviteModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// create invite
const createInvite = async (req, res) => {
    const { toEmail, boardId } = req.body;
    const emptyFields = [];
    if (!toEmail) {
        emptyFields.push('email');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all the required fields (BE).',
            emptyFields,
        });
    }
    try {
        const fromId = req.user._id;
        const toUser = await User.findOne({ email: toEmail });
        const invite = await Invite.create({
            fromId: fromId,
            toId: toUser._id,
            boardId: boardId,
            status: 'Pending',
        });
        res.status(200).json(invite);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = { createInvite };
