import { useAuthContext } from './useAuthContext';
import { useBoardContext } from './useBoardContext';
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: boardsDispatch } = useBoardContext();
    const logout = async () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        boardsDispatch({ type: 'SET_BOARDS', payload: null });
    };
    return { logout };
};
