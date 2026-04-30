import { create } from 'zustand';

const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuthStore = create((set) => ({
    user: getStoredUser(),
    login: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    signup: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },
}));
