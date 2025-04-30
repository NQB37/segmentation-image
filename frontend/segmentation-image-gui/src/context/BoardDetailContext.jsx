import { createContext, useReducer } from 'react';

export const BoardDetailContext = createContext();

export const boardDetailReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARDS':
            return { boards: action.payload };
        case 'CREATE_BOARD':
            return { boards: [action.payload, ...state.boards] };
        case 'DELETE_BOARD':
            return {
                boards: state.boards.filter(
                    (board) => board._id !== action.payload._id,
                ),
            };
        default:
            return state;
    }
};

export const BoardDetailContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(boardDetailReducer, {
        labels: [],
        members: [],
    });
    return (
        <BoardDetailContext.Provider value={{ ...state, dispatch }}>
            {children}
        </BoardDetailContext.Provider>
    );
};
