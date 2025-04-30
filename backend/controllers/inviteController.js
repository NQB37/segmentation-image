const Invite = require('../models/inviteModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// send invite
const sendInvite = async (req, res) => {
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
        res.status(400).json({ error: error.message });
    }
};

// handle change status
const respondInvite = async (req, res) => {
    try {
        const { inviteId, status } = req.body;
        const invite = await Invite.findById(inviteId);
        if (!invite) {
            throw Error('Invite not found.');
        }
        invite.status = status;
        await invite.save();

        if (status === 'Accepted') {
            const board = await Board.findById(invite.boardId);
            if (!board) {
                throw Error('Board not found.');
            }

            if (!board.membersId.includes(invite.toId)) {
                board.membersId.push(invite.toId);
                await board.save();
            }
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
module.exports = { sendInvite, respondInvite };
