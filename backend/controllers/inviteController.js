import Invite from '../models/inviteModel.js';
import User from '../models/userModel.js';
import Board from '../models/boardModel.js';
import mongoose from 'mongoose';

// get all invites
const getInvites = async (req, res) => {
    try {
        const invites = await Invite.find({
            toId: req.user._id,
            status: 'Pending',
        })
            .sort({ createdAt: -1 })
            .populate({ path: 'boardId', select: '_id title image' });

        return res.status(200).json(invites);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// send invite
const sendInvite = async (req, res) => {
    try {
        const { toEmail, boardId } = req.body;
        const emptyFields = [];

        if (!toEmail) {
            emptyFields.push('toEmail');
        }
        if (!boardId) {
            emptyFields.push('boardId');
        }
        if (emptyFields.length > 0) {
            return res.status(400).json({
                error: 'Please fill in all the required fields (BE).',
                emptyFields,
            });
        }

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID.' });
        }

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Board not found.' });
        }

        if (!board.ownerId.equals(req.user._id)) {
            return res.status(403).json({ error: 'Not authorized.' });
        }

        const normalizedEmail = toEmail.trim().toLowerCase();
        const toUser = await User.findOne({ email: normalizedEmail });
        if (!toUser) {
            return res.status(404).json({ error: 'User not exists.' });
        }

        if (toUser._id.equals(req.user._id)) {
            return res.status(400).json({ error: 'Cannot invite yourself.' });
        }

        const isMember = board.membersId.some((memberId) =>
            memberId.equals(toUser._id),
        );
        if (isMember) {
            return res
                .status(409)
                .json({ error: 'User is already a board member.' });
        }

        const existing = await Invite.findOne({
            toId: toUser._id,
            boardId,
            status: 'Pending',
        });
        if (existing) {
            return res.status(409).json({
                error: 'Already send invite to this user.',
                inviteId: existing._id,
            });
        }

        const invite = await Invite.create({
            toId: toUser._id,
            boardId,
            status: 'Pending',
        });

        return res.status(200).json(invite);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ error: 'Already sent invite to this user.' });
        }
        return res.status(400).json({ error: error.message });
    }
};

// handle change status
const respondInvite = async (req, res) => {
    try {
        const inviteId = req.body.inviteId || req.params.id;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(inviteId)) {
            return res.status(400).json({ error: 'Invalid invite ID.' });
        }

        const normalizedStatus = status && status.toLowerCase();
        if (!['accept', 'cancel'].includes(normalizedStatus)) {
            return res.status(400).json({ error: 'Invalid invite status.' });
        }

        const invite = await Invite.findOne({
            _id: inviteId,
            toId: req.user._id,
            status: 'Pending',
        });
        if (!invite) {
            return res.status(404).json({ error: 'Invite not found.' });
        }

        const nextStatus =
            normalizedStatus === 'accept' ? 'Accepted' : 'Canceled';

        if (normalizedStatus === 'accept') {
            const board = await Board.findById(invite.boardId);
            if (!board) {
                return res.status(404).json({ error: 'Board not found.' });
            }
        }

        const updatedInvite = await Invite.findOneAndUpdate(
            {
                _id: invite._id,
                toId: req.user._id,
                status: 'Pending',
            },
            { $set: { status: nextStatus } },
            { new: true },
        );
        if (!updatedInvite) {
            return res.status(404).json({ error: 'Invite not found.' });
        }

        if (normalizedStatus === 'accept') {
            await Board.findByIdAndUpdate(invite.boardId, {
                $addToSet: { membersId: req.user._id },
            });
        }

        return res.status(200).json(updatedInvite);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export { getInvites, sendInvite, respondInvite };
