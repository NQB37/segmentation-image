import mongoose from 'mongoose';
import Board from '../models/boardModel.js';
import Label from '../models/labelModel.js';
import User from '../models/userModel.js';
import {
    readableBoardFilter,
    ownerBoardFilter,
    pickBoardUpdates,
} from '../utils/boardAccess.js';

const serviceError = (status, message, details = {}) =>
    Object.assign(new Error(message), { status, ...details });

const normalizeId = (value) => value?._id || value;

const isSameId = (firstId, secondId) =>
    normalizeId(firstId)?.toString() === normalizeId(secondId)?.toString();

const boardHasMember = (board, userId) =>
    board.membersId?.some((memberId) => isSameId(memberId, userId));

const boardHasLabel = (board, labelId) =>
    board.labelsId?.some((currentLabelId) => isSameId(currentLabelId, labelId));

const assertValidObjectId = (id, message) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw serviceError(404, message);
    }
};

const loadBoardForOwner = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        throw serviceError(404, 'Board not exists.');
    }
    if (!isSameId(board.ownerId, userId)) {
        throw serviceError(403, 'Request not authorized.');
    }
    return board;
};

const listBoards = (userId) =>
    Board.find({
        $or: [{ ownerId: userId }, { membersId: userId }],
    }).sort({ createdAt: -1 });

const getBoardDetails = async (boardId, userId) => {
    assertValidObjectId(boardId, 'Board not exists.');

    const board = await Board.findById(boardId)
        .populate([
            { path: 'labelsId' },
            { path: 'membersId', select: '_id email name avatar' },
        ])
        .exec();

    if (!board) {
        throw serviceError(404, 'Board not exists.');
    }
    if (!isSameId(board.ownerId, userId) && !boardHasMember(board, userId)) {
        throw serviceError(403, 'Request not authorized.');
    }

    return board;
};

const createBoardForUser = async ({ title, image }, userId) => {
    const emptyFields = [];
    if (!title) {
        emptyFields.push('title');
    }
    if (!image) {
        emptyFields.push('image');
    }
    if (emptyFields.length > 0) {
        throw serviceError(400, 'Please fill in all the required fields (BE).', {
            emptyFields,
        });
    }

    return Board.create({
        title,
        image,
        ownerId: userId,
        membersId: [],
        labelsId: [],
        annotationImage: '',
        segmentImage: '',
    });
};

const updateBoardForUser = async (boardId, userId, body) => {
    assertValidObjectId(boardId, 'Board not exists.');

    const board = await Board.findById(boardId).select('ownerId membersId');
    if (!board) {
        throw serviceError(404, 'Board not exists.');
    }

    const isOwner = isSameId(board.ownerId, userId);
    const isMember = boardHasMember(board, userId);
    if (!isOwner && !isMember) {
        throw serviceError(403, 'Request not authorized.');
    }

    const updates = pickBoardUpdates(body, isOwner);
    if (Object.keys(updates).length === 0) {
        throw serviceError(400, 'No valid board updates provided.');
    }

    const updatedBoard = await Board.findOneAndUpdate(
        readableBoardFilter(boardId, userId),
        { $set: updates },
        { new: true, runValidators: true },
    );
    if (!updatedBoard) {
        throw serviceError(403, 'Request not authorized.');
    }

    return updatedBoard;
};

const deleteBoardForUser = async (boardId, userId) => {
    assertValidObjectId(boardId, 'Board not exists.');

    const board = await Board.findById(boardId);
    if (!board) {
        throw serviceError(404, 'Board not found.');
    }
    if (!isSameId(board.ownerId, userId)) {
        throw serviceError(403, 'Request not authorized.');
    }

    const deletedBoard = await Board.findOneAndDelete(
        ownerBoardFilter(boardId, userId),
    );

    if (deletedBoard.labelsId?.length) {
        const labelIdsToCheck = deletedBoard.labelsId;
        const stillReferenced = await Board.distinct('labelsId', {
            labelsId: { $in: labelIdsToCheck },
        });
        const stillReferencedIds = new Set(stillReferenced.map(String));
        const orphanedLabelIds = labelIdsToCheck.filter(
            (labelId) => !stillReferencedIds.has(labelId.toString()),
        );

        if (orphanedLabelIds.length > 0) {
            await Label.deleteMany({ _id: { $in: orphanedLabelIds } });
        }
    }

    return deletedBoard;
};

const createBoardLabel = async (boardId, userId, { title, color }) => {
    assertValidObjectId(boardId, 'Board not exists.');

    const emptyFields = [];
    if (!title) {
        emptyFields.push('title');
    }
    if (!color) {
        emptyFields.push('color');
    }
    if (emptyFields.length > 0) {
        throw serviceError(400, 'Please fill in all the required fields (BE).', {
            emptyFields,
        });
    }

    await loadBoardForOwner(boardId, userId);

    const label = await Label.create({ title, color });
    await Board.findOneAndUpdate(
        ownerBoardFilter(boardId, userId),
        { $addToSet: { labelsId: label._id } },
        { new: true, runValidators: true },
    );

    return label;
};

const deleteBoardLabel = async (boardId, labelId, userId) => {
    assertValidObjectId(boardId, 'Board not exists.');
    assertValidObjectId(labelId, 'Label not exists.');

    const board = await loadBoardForOwner(boardId, userId);
    if (!boardHasLabel(board, labelId)) {
        throw serviceError(404, 'Label not found on board.');
    }

    const label = await Label.findById(labelId);
    if (!label) {
        throw serviceError(404, 'Label not found.');
    }

    await Board.findOneAndUpdate(
        ownerBoardFilter(boardId, userId),
        { $pull: { labelsId: labelId } },
        { new: true },
    );

    const remainingReferences = await Board.countDocuments({
        labelsId: labelId,
    });
    if (remainingReferences === 0) {
        await Label.findOneAndDelete({ _id: labelId });
    }

    return label;
};

const deleteBoardMember = async (boardId, memberId, userId) => {
    assertValidObjectId(boardId, 'Board not exists.');
    assertValidObjectId(memberId, 'User not exists.');

    const board = await loadBoardForOwner(boardId, userId);
    if (!boardHasMember(board, memberId)) {
        throw serviceError(404, 'Member not found on board.');
    }

    const member = await User.findById(memberId).select('_id email name avatar');
    if (!member) {
        throw serviceError(404, 'Member not found.');
    }

    await Board.findOneAndUpdate(
        ownerBoardFilter(boardId, userId),
        { $pull: { membersId: memberId } },
        { new: true },
    );

    return member;
};

export {
    createBoardForUser,
    createBoardLabel,
    deleteBoardForUser,
    deleteBoardLabel,
    deleteBoardMember,
    getBoardDetails,
    listBoards,
    updateBoardForUser,
};
