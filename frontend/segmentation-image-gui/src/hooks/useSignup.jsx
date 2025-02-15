import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { toast } from 'react-toastify';

export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const signup = async (email, name, password, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3700/api/userRoute/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password, confirmPassword }),
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
            dispatch({ type: 'SIGNUP', payload: json });
            setIsLoading(false);
            toast.success('Signup successfully.');
            return { success: true };
        }
    };
    return { signup, isLoading, error };
};
