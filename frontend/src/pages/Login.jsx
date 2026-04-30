import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../lib/authValidation';
import LoadingIcon from '../components/Share/LoadingIcon';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useLogin();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleLogin = async (data) => {
        const res = await login(data.email, data.password);
        if (res.error) {
            setError('root.server', { message: res.error });
            return;
        }
        navigate('/board');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-red-400 px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit(handleLogin)} noValidate>
                    {errors.root?.server && (
                        <p className="mb-4 text-sm text-red-600">
                            {errors.root.server.message}
                        </p>
                    )}
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
                            aria-invalid={Boolean(errors.email)}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
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
                            aria-invalid={Boolean(errors.password)}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-400 text-black py-2 rounded border border-gray-300 hover:bg-gray-300"
                        >
                            {isLoading ? <LoadingIcon /> : <>Login</>}
                        </button>
                    </div>
                </form>
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
