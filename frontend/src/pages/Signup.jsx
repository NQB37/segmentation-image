import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useSignUp } from '../hooks/useSignup';
import LoadingIcon from '../components/Share/LoadingIcon';
import {
    getPasswordRuleResults,
    signupSchema,
} from '../lib/authValidation';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useSignUp();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        },
    });
    const passwordRuleResults = getPasswordRuleResults(watch('password'));

    const handleSignup = async (data) => {
        const res = await signup(
            data.email,
            data.name,
            data.password,
            data.confirmPassword,
        );
        if (res.error) {
            setError('root.server', { message: res.error });
            return;
        }
        navigate('/board');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-red-400 px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>
                <form onSubmit={handleSubmit(handleSignup)} noValidate>
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
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            type="text"
                            id="name"
                            aria-invalid={Boolean(errors.name)}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
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
                        <div className="mt-2 space-y-1">
                            {passwordRuleResults.map((rule) => {
                                const Icon = rule.isValid ? Check : X;
                                return (
                                    <div
                                        key={rule.key}
                                        className={`flex items-center gap-2 text-sm ${
                                            rule.isValid
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span>{rule.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm mb-2"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            type="password"
                            id="confirmPassword"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-400 text-black py-2 rounded border border-gray-300 hover:bg-gray-300"
                        >
                            {isLoading ? <LoadingIcon /> : <>Signup</>}
                        </button>
                    </div>
                </form>
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
