import mongoose from 'mongoose';
import Invite from '../models/inviteModel.js';
import User from '../models/userModel.js';
import Board from '../models/boardModel.js';
import { createNotification } from './notificationService.js';

const serviceError = (status, message, details = {}) =>
  Object.assign(new Error(message), { status, ...details });

const listInvites = (userId) =>
  Invite.find({
    toId: userId,
    status: 'Pending',
  })
    .sort({ createdAt: -1 })
    .populate({ path: 'boardId', select: '_id title image' });

const createInvite = async ({ toEmail, boardId }, userId) => {
  const emptyFields = [];

  if (!toEmail) {
    emptyFields.push('toEmail');
  }
  if (!boardId) {
    emptyFields.push('boardId');
  }
  if (emptyFields.length > 0) {
    throw serviceError(400, 'Please fill in all the required fields (BE).', {
      emptyFields,
    });
  }

  if (!mongoose.isValidObjectId(boardId)) {
    throw serviceError(400, 'Invalid board ID.');
  }

  const board = await Board.findById(boardId);
  if (!board) {
    throw serviceError(404, 'Board not found.');
  }

  if (!board.ownerId.equals(userId)) {
    throw serviceError(403, 'Not authorized.');
  }

  const normalizedEmail = toEmail.trim().toLowerCase();
  const toUser = await User.findOne({ email: normalizedEmail });
  if (!toUser) {
    throw serviceError(404, 'User not exists.');
  }

  if (toUser._id.equals(userId)) {
    throw serviceError(400, 'Cannot invite yourself.');
  }

  const isMember = board.membersId.some((memberId) =>
    memberId.equals(toUser._id),
  );
  if (isMember) {
    throw serviceError(409, 'User is already a board member.');
  }

  const existing = await Invite.findOne({
    toId: toUser._id,
    boardId,
    status: 'Pending',
  });
  if (existing) {
    throw serviceError(409, 'Already send invite to this user.', {
      inviteId: existing._id,
    });
  }

  const invite = await Invite.create({
    toId: toUser._id,
    boardId,
    status: 'Pending',
  });

  try {
    await createNotification({
      toId: toUser._id,
      fromId: userId,
      type: 'invite.created',
      title: 'Project invite',
      message: `You were invited to join ${board.title}.`,
      boardId: board._id,
      inviteId: invite._id,
    });
  } catch (error) {
    console.error('Failed to create invite notification:', error.message);
  }

  return invite;
};

const updateInviteStatus = async (inviteId, status, userId) => {
  if (!mongoose.isValidObjectId(inviteId)) {
    throw serviceError(400, 'Invalid invite ID.');
  }

  const normalizedStatus = status && status.toLowerCase();
  if (!['accept', 'cancel'].includes(normalizedStatus)) {
    throw serviceError(400, 'Invalid invite status.');
  }

  const invite = await Invite.findOne({
    _id: inviteId,
    toId: userId,
    status: 'Pending',
  });
  if (!invite) {
    throw serviceError(404, 'Invite not found.');
  }

  const nextStatus = normalizedStatus === 'accept' ? 'Accepted' : 'Canceled';

  if (normalizedStatus === 'accept') {
    const board = await Board.findById(invite.boardId);
    if (!board) {
      throw serviceError(404, 'Board not found.');
    }
  }

  const updatedInvite = await Invite.findOneAndUpdate(
    {
      _id: invite._id,
      toId: userId,
      status: 'Pending',
    },
    { $set: { status: nextStatus } },
    { new: true },
  );
  if (!updatedInvite) {
    throw serviceError(404, 'Invite not found.');
  }

  if (normalizedStatus === 'accept') {
    await Board.findByIdAndUpdate(invite.boardId, {
      $addToSet: { membersId: userId },
    });
  }

  return updatedInvite;
};

export { createInvite, listInvites, updateInviteStatus };
