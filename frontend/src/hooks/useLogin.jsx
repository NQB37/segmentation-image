import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'react-toastify';
import apiClient from '../api/client';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const loginUser = useAuthStore((state) => state.login);
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.post(
                '/api/userRoute/login',
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );
            const json = res.data;

            loginUser(json);
            setIsLoading(false);
            toast.success('Login successfully.');
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Login failed.';
            setIsLoading(false);
            setError(errorMessage);
            return { error: errorMessage };
        }
    };
    return { login, isLoading, error };
};
