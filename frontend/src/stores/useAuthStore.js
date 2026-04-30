import { create } from 'zustand';

const getUserIdFromToken = (token) => {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split('.')[1];
        if (!payload) {
            return null;
        }

        const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
        const parsed = JSON.parse(atob(normalizedPayload));
        return parsed._id || null;
    } catch {
        return null;
    }
};

const normalizeUser = (user) => {
    if (!user || user._id) {
        return user;
    }

    const tokenUserId = getUserIdFromToken(user.token);
    return tokenUserId ? { ...user, _id: tokenUserId } : user;
};

const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        return normalizeUser(JSON.parse(storedUser));
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const useAuthStore = create((set) => ({
    user: getStoredUser(),
    login: (user) => {
        const normalizedUser = normalizeUser(user);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        set({ user: normalizedUser });
    },
    signup: (user) => {
        const normalizedUser = normalizeUser(user);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        set({ user: normalizedUser });
    },
    logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },
}));
