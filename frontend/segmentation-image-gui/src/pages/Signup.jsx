import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSignUp } from '../hooks/useSignup';
import LoadingIcon from '../components/Share/LoadingIcon';

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signup, error, isLoading } = useSignUp();

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    const handleSignup = async () => {
        if (!email || !name || !password || !confirmPassword) {
            toast.error('Please fill in all the required fields.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password is not match.');
            return;
        }
        const res = await signup(email, name, password, confirmPassword);
        if (res.error) {
            toast.error(res.error);
            return;
        }
        navigate('/board');
    };
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-red-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="username"
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
                        onKeyDown={handleEnter}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="username"
                    >
                        Name
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleEnter}
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
                        onKeyDown={handleEnter}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="password"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleEnter}
                    />
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleSignup}
                        disabled={isLoading}
                        className="w-full bg-blue-400 text-black py-2 rounded border border-gray-300 hover:bg-gray-300"
                    >
                        {isLoading ? <LoadingIcon /> : <>Signup</>}
                    </button>
                </div>
                <div className="text-center text-sm">
                    Already a Member ?{' '}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
