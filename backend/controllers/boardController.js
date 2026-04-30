import {
    createBoardForUser,
    createBoardLabel,
    deleteBoardForUser,
    deleteBoardLabel,
    deleteBoardMember,
    leaveBoardForUser,
    getBoardDetails,
    listBoards,
    updateBoardForUser,
} from '../services/boardService.js';

const sendError = (res, error, fallbackStatus) =>
    res.status(error.status || fallbackStatus).json({
        error: error.message,
        ...(error.emptyFields ? { emptyFields: error.emptyFields } : {}),
    });

const getBoards = async (req, res) => {
    try {
        const boards = await listBoards(req.user._id);
        return res.status(200).json(boards);
    } catch (error) {
        return sendError(res, error, 500);
    }
};

const getBoardById = async (req, res) => {
    try {
        const board = await getBoardDetails(req.params.id, req.user._id);
        return res.status(200).json(board);
    } catch (error) {
        return sendError(res, error, 500);
    }
};

const createBoard = async (req, res) => {
    try {
        const board = await createBoardForUser(req.body, req.user._id);
        return res.status(200).json(board);
    } catch (error) {
        return sendError(res, error, 400);
    }
};

const updateBoard = async (req, res) => {
    try {
        const board = await updateBoardForUser(
            req.params.id,
            req.user._id,
            req.body,
        );
        return res.status(200).json(board);
    } catch (error) {
        return sendError(res, error, 400);
    }
};

const deleteBoard = async (req, res) => {
    try {
        const board = await deleteBoardForUser(req.params.id, req.user._id);
        return res.status(200).json(board);
    } catch (error) {
        return sendError(res, error, 500);
    }
};

const newLabel = async (req, res) => {
    try {
        const label = await createBoardLabel(
            req.params.id,
            req.user._id,
            req.body,
        );
        return res.status(200).json(label);
    } catch (error) {
        if (!error.status) {
            error.message = `${error.message} BE.`;
        }
        return sendError(res, error, 400);
    }
};

const deleteLabel = async (req, res) => {
    try {
        const label = await deleteBoardLabel(
            req.params.id,
            req.params.labelId,
            req.user._id,
        );
        return res.status(200).json(label);
    } catch (error) {
        return sendError(res, error, 500);
    }
};

const deleteMember = async (req, res) => {
    try {
        const member = await deleteBoardMember(
            req.params.id,
            req.params.memberId,
            req.user._id,
        );
        return res.status(200).json(member);
    } catch (error) {
        return sendError(res, error, 500);
    }
};

const leaveBoard = async (req, res) => {
    try {
        const board = await leaveBoardForUser(req.params.id, req.user._id);
        return res.status(200).json(board);
    } catch (error) {
        return sendError(res, error, 500);
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
    leaveBoard,
};
