const Invite = require("../models/inviteModel");
const User = require("../models/userModel");
const Board = require("../models/boardModel");
const mongoose = require("mongoose");

// get all invites
const getInvites = async (req, res) => {
  const userId = req.user._id;
  const invites = await Invite.find({ toId: userId, status: "Pending" })
    .sort({
      createAt: -1,
    })
    .populate({ path: "boardId", select: "_id title image" });
  res.status(200).json(invites);
};

// send invite
const sendInvite = async (req, res) => {
  const { toEmail, boardId } = req.body;
  const emptyFields = [];
  if (!toEmail) {
    emptyFields.push("email");
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in all the required fields (BE).",
      emptyFields,
    });
  }

  try {
    // board check by id
    if (!mongoose.isValidObjectId(boardId)) {
      return res.status(400).json({ error: "Invalid board ID." });
    }
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ error: "Board not found." });

    // user check by email
    const toUser = await User.findOne({ email: toEmail.toLowerCase() });
    if (!toUser) {
      return res.status(404).json({ error: "User not exists." });
    }

    // check exist invite
    const existing = await Invite.findOne({
      toId: toUser._id,
      boardId,
      status: "pending",
    });
    if (existing) {
      return res.status(409).json({
        error: "Already send invite to this user.",
        inviteId: existing._id,
      });
    }

    // invite
    const invite = await Invite.create({
      toId: toUser._id,
      boardId,
      status: "Pending",
    });
    res.status(200).json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// handle change status
const respondInvite = async (req, res) => {
  const { inviteId, status } = req.body;

  const invite = await Invite.findById(inviteId);
  if (!invite) {
    throw Error("Invite not found.");
  }

  try {
    if (status.toLowerCase() === "accept") {
      const board = await Board.findByIdAndUpdate(
        invite.boardId,
        { $addToSet: { membersId: invite.toId } },
        { new: true }
      );
      if (!board) return res.status(404).json({ error: "Board not found." });
    }

    await Invite.findOneAndUpdate(
      { _id: inviteId, toId: req.user._id },
      { $set: { status } },
      { new: true }
    );

    return res.status(200).json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getInvites, sendInvite, respondInvite };
