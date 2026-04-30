import { create } from 'zustand';

export const useBoardStore = create((set) => ({
    boards: [],
    setBoards: (boards) => set({ boards }),
    createBoard: (board) =>
        set((state) => ({ boards: [board, ...state.boards] })),
    deleteBoard: (deletedBoard) =>
        set((state) => ({
            boards: state.boards.filter(
                (board) => board._id !== deletedBoard._id,
            ),
        })),
    clearBoards: () => set({ boards: [] }),
}));
