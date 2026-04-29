import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../api/client';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
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

            // save user
            localStorage.setItem('user', JSON.stringify(json));
            // update auth
            dispatch({ type: 'LOGIN', payload: json });
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
