import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../api/client';

export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const signup = async (email, name, password, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.post(
                '/api/userRoute/signup',
                { email, name, password, confirmPassword },
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );
            const json = res.data;

            // save user
            localStorage.setItem('user', JSON.stringify(json));
            // update auth
            dispatch({ type: 'SIGNUP', payload: json });
            setIsLoading(false);
            toast.success('Signup successfully.');
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Signup failed.';
            setIsLoading(false);
            setError(errorMessage);
            return { error: errorMessage };
        }
    };
    return { signup, isLoading, error };
};
