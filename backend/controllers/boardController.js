import Board from '../models/boardModel.js';
import Label from '../models/labelModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import {
    readableBoardFilter,
    ownerBoardFilter,
    pickBoardUpdates,
} from '../utils/boardAccess.js';

const normalizeId = (value) => value?._id || value;

const isSameId = (firstId, secondId) =>
    normalizeId(firstId)?.toString() === normalizeId(secondId)?.toString();

const boardHasMember = (board, userId) =>
    board.membersId?.some((memberId) => isSameId(memberId, userId));

const boardHasLabel = (board, labelId) =>
    board.labelsId?.some((currentLabelId) => isSameId(currentLabelId, labelId));

const loadBoardForOwner = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        return { status: 404, error: 'Board not exists.' };
    }
    if (!isSameId(board.ownerId, userId)) {
        return { status: 403, error: 'Request not authorized.' };
    }
    return { board };
};

// get all boards
const getBoards = async (req, res) => {
    try {
        const userId = req.user._id;
        const boards = await Board.find({
            $or: [{ ownerId: userId }, { membersId: userId }],
        }).sort({ createdAt: -1 });
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get board by id
const getBoardById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }

    try {
        const board = await Board.findById(id)
            .populate([
                { path: 'labelsId' },
                { path: 'membersId', select: '_id email name avatar' },
            ])
            .exec();

        if (!board) {
            return res.status(404).json({ error: 'Board not exists.' });
        }
        if (
            !isSameId(board.ownerId, req.user._id) &&
            !boardHasMember(board, req.user._id)
        ) {
            return res.status(403).json({ error: 'Request not authorized.' });
        }

        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// create a new board
const createBoard = async (req, res) => {
    const { title, image } = req.body;
    const emptyFields = [];
    if (!title) {
        emptyFields.push('title');
    }
    if (!image) {
        emptyFields.push('image');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all the required fields (BE).',
            emptyFields,
        });
    }

    try {
        const board = await Board.create({
            title,
            image,
            ownerId: req.user._id,
            membersId: [],
            labelsId: [],
            annotationImage: '',
            segmentImage: '',
        });
        res.status(200).json(board);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// update board
const updateBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }

    try {
        const board = await Board.findById(id).select('ownerId membersId');
        if (!board) {
            return res.status(404).json({ error: 'Board not exists.' });
        }

        const isOwner = isSameId(board.ownerId, req.user._id);
        const isMember = boardHasMember(board, req.user._id);
        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'Request not authorized.' });
        }

        const updates = pickBoardUpdates(req.body, isOwner);
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid board updates provided.' });
        }

        const updatedBoard = await Board.findOneAndUpdate(
            readableBoardFilter(id, req.user._id),
            { $set: updates },
            { new: true, runValidators: true },
        );
        if (!updatedBoard) {
            return res.status(403).json({ error: 'Request not authorized.' });
        }

        res.status(200).json(updatedBoard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete board by id
const deleteBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }

    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({ error: 'Board not found.' });
        }
        if (!isSameId(board.ownerId, req.user._id)) {
            return res.status(403).json({ error: 'Request not authorized.' });
        }

        const deletedBoard = await Board.findOneAndDelete(
            ownerBoardFilter(id, req.user._id),
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

        res.status(200).json(deletedBoard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// add a new label
const newLabel = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }

    const { title, color } = req.body;
    const emptyFields = [];
    if (!title) {
        emptyFields.push('title');
    }
    if (!color) {
        emptyFields.push('color');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all the required fields (BE).',
            emptyFields,
        });
    }

    try {
        const access = await loadBoardForOwner(id, req.user._id);
        if (!access.board) {
            return res.status(access.status).json({ error: access.error });
        }

        const label = await Label.create({ title, color });
        await Board.findOneAndUpdate(
            ownerBoardFilter(id, req.user._id),
            { $addToSet: { labelsId: label._id } },
            { new: true, runValidators: true },
        );

        res.status(200).json(label);
    } catch (error) {
        res.status(400).json({ error: `${error.message} BE.` });
    }
};

// delete label
const deleteLabel = async (req, res) => {
    const { id, labelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    if (!mongoose.Types.ObjectId.isValid(labelId)) {
        return res.status(404).json({ error: 'Label not exists.' });
    }

    try {
        const access = await loadBoardForOwner(id, req.user._id);
        if (!access.board) {
            return res.status(access.status).json({ error: access.error });
        }
        if (!boardHasLabel(access.board, labelId)) {
            return res.status(404).json({ error: 'Label not found on board.' });
        }

        const label = await Label.findById(labelId);
        if (!label) {
            return res.status(404).json({ error: 'Label not found.' });
        }

        await Board.findOneAndUpdate(
            ownerBoardFilter(id, req.user._id),
            { $pull: { labelsId: labelId } },
            { new: true },
        );

        const remainingReferences = await Board.countDocuments({
            labelsId: labelId,
        });
        if (remainingReferences === 0) {
            await Label.findOneAndDelete({ _id: labelId });
        }

        res.status(200).json(label);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// handle delete member
const deleteMember = async (req, res) => {
    const { id, memberId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(404).json({ error: 'User not exists.' });
    }

    try {
        const access = await loadBoardForOwner(id, req.user._id);
        if (!access.board) {
            return res.status(access.status).json({ error: access.error });
        }
        if (!boardHasMember(access.board, memberId)) {
            return res.status(404).json({ error: 'Member not found on board.' });
        }

        const member = await User.findById(memberId).select(
            '_id email name avatar',
        );
        if (!member) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        await Board.findOneAndUpdate(
            ownerBoardFilter(id, req.user._id),
            { $pull: { membersId: memberId } },
            { new: true },
        );
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    newLabel,
    deleteLabel,
    deleteMember,
};
