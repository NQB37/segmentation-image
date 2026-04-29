import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    newLabel,
    deleteLabel,
    deleteMember,
} from '../controllers/boardController.js';

const router = express.Router();

// requre auth for all routes
router.use(requireAuth);

// GET all
router.get("/", getBoards);

// GET by id
router.get("/:id", getBoardById);

// POST a new board
router.post("/", createBoard);

// UPDATE a new board
router.patch("/:id", updateBoard);

// DELETE a new board
router.delete("/:id", deleteBoard);

// POST a new label
router.post("/:id/label", newLabel);

// DELETE a label
router.delete("/:id/label/:labelId", deleteLabel);

// DELETE a member
router.delete("/:id/member/:memberId", deleteMember);

export default router;
