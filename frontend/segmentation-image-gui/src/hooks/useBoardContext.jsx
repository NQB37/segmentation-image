import { BoardContext } from '../context/BoardContext';
import { useContext } from 'react';
export const useBoardContext = () => {
    const context = useContext(BoardContext);
    if (!context)
        throw Error('useBoardContext must be used inside BoardContextProvider');
    return context;
};
