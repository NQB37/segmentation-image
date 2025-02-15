import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { toast } from 'react-toastify';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3700/api/userRoute/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (!res.ok) {
            setIsLoading(false);
            setError(json.error);
            return { error: json.error };
        } else {
            // save user
            localStorage.setItem('user', JSON.stringify(json));
            // update auth
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
            toast.success('Login successfully.');
            return { success: true };
        }
    };
    return { login, isLoading, error };
};
