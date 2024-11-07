import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {};
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-red-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleSignup}
                        className="w-full bg-blue-400 text-black py-2 rounded border border-gray-300 hover:bg-gray-300"
                    >
                        Signup
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
