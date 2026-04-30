import { useAuthStore } from '../stores/useAuthStore';
import { useBoardStore } from '../stores/useBoardStore';
export const useLogout = () => {
    const logoutUser = useAuthStore((state) => state.logout);
    const clearBoards = useBoardStore((state) => state.clearBoards);
    const logout = async () => {
        logoutUser();
        clearBoards();
    };
    return { logout };
};
