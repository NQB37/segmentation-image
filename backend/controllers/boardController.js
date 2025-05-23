const Board = require('../models/boardModel');
const Label = require('../models/labelModel');
const mongoose = require('mongoose');

// get all boards
const getBoards = async (req, res) => {
    const userId = req.user._id;
    const boards = await Board.find({
        $or: [{ ownerId: userId }, { membersId: userId }],
    }).sort({ createdAt: -1 });
    res.status(200).json(boards);
};

// get board by id
const getBoardById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    const board = await Board.findById(id)
        .populate([
            { path: 'labelsId' },
            { path: 'membersId', select: '_id name avatar' },
        ])
        .exec();
    if (!board) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    res.status(200).json(board);
};

// create a new board
const createBoard = async (req, res) => {
    const { title, ownerId, membersId, labelsId, image } = req.body;
    const emptyFields = [];
    if (!title) {
        emptyFields.push('title');
    }
    if (!ownerId) {
        emptyFields.push('ownerId');
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
        const ownerId = req.user._id;
        const board = await Board.create({
            title,
            image,
            ownerId,
            membersId,
            labelsId,
            ownerId,
            annotationImage: '',
            segmentImage: '',
        });
        res.status(200).json(board);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// update board
const updateBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    const board = await Board.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!board) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    res.status(200).json(board);
};

// delete board by id
const deleteBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    try {
        // delete board
        const board = await Board.findOneAndDelete({ _id: id });
        if (!board) {
            return res.status(404).json({ error: 'Board not found.' });
        }

        // delete relate labels
        if (board.labelsId?.length) {
            await Label.deleteMany({ _id: { $in: board.labelsId } });
        }

        res.status(200).json(board);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// add a new label
const newLabel = async (req, res) => {
    // get board id
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    // get title and color of new label
    const { title, color } = req.body;
    const emptyFields = [];
    if (!color) {
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
        //create new label
        const label = await Label.create({ title, color });
        // update board
        const board = await Board.findOneAndUpdate(
            { _id: id },
            { $addToSet: { labelsId: label._id } },
            { new: true },
        ).populate('labelsId');
        if (!board) {
            return res.status(404).json({ error: 'Board not exists.' });
        }
        res.status(200).json(label);
    } catch (error) {
        res.status(404).json({ error: `${error.message} BE.` });
    }
};

// delete label
const deleteLabel = async (req, res) => {
    // get board and label id
    const { id, labelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists.' });
    }
    if (!mongoose.Types.ObjectId.isValid(labelId)) {
        return res.status(404).json({ error: 'Label not exists.' });
    }
    try {
        const label = await Label.findOneAndDelete({ _id: labelId });
        if (!label) {
            return res.status(404).json({ error: 'Label not found.' });
        }

        await Board.updateMany(
            { labelsId: labelId },
            { $pull: { labelsId: labelId } },
        );

        res.status(200).json(label);
    } catch (error) {}
};
module.exports = {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    newLabel,
    deleteLabel,
};
