const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();
const {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
} = require('../controllers/boardController');

// requre auth for all routes
router.use(requireAuth);

// GET all
router.get('/', getBoards);

// GET by id
router.get('/:id', getBoardById);

// POST a new board
router.post('/', createBoard);

// UPDATE a new board
router.patch('/:id', updateBoard);

// DELETE a new board
router.delete('/:id', deleteBoard);
module.exports = router;
