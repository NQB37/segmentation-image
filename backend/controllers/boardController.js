const Board = require('../models/boardModel');
const mongoose = require('mongoose');

// get all boards
const getBoards = async (req, res) => {
    const ownerId = req.user._id;
    const boards = await Board.find({ ownerId }).sort({ createAt: -1 });
    // const boards = await Board.find().sort({ createAt: -1 });
    res.status(200).json(boards);
};

// get board by id
const getBoardById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists' });
    }
    const board = await Board.findById(id);
    if (!board) {
        return res.status(404).json({ error: 'Board not exists' });
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
            labelsId,
            ownerId,
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
        return res.status(404).json({ error: 'Board not exists' });
    }
    const board = await Board.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!board) {
        return res.status(404).json({ error: 'Board not exists' });
    }
    res.status(200).json(board);
};

// delete board by id
const deleteBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Board not exists' });
    }
    const board = await Board.findOneAndDelete({ _id: id }).sort({
        createAt: -1,
    });
    if (!board) {
        return res.status(404).json({ error: 'Board not exists' });
    }
    res.status(200).json(board);
};

module.exports = {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
};
