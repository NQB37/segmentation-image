import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
        if (error != null) {
            toast.error(error);
            return;
        }
        navigate('/board');
    };
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-red-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-400 text-black py-2 rounded border border-gray-300 hover:bg-gray-300"
                    >
                        Login
                    </button>
                </div>
                <div className="text-center text-sm">
                    Not a Member ?{' '}
                    <Link to="/signup" className="text-blue-500">
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
