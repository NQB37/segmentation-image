import { useState } from 'react';
import { toast } from 'react-toastify';
import BtnGray from '../../Share/BtnGray';
import BtnGreen from '../../Share/BtnGreen';
import axios from 'axios';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ChangePassword = () => {
    const { user } = useAuthContext();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toggleModal = () => {
        clearForm();
        setIsModalOpened(!isModalOpened);
    };

    const clearForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };
    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all the required fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Password is not match.');
            return;
        }

        const newInfo = { currentPassword, newPassword, confirmPassword };

        try {
            const res = await axios.patch(
                'http://localhost:3700/api/userRoute/change-password',
                newInfo,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toggleModal();
            toast.success('Change password successfully.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };
    return (
        <>
            <button
                onClick={toggleModal}
                className="w-fit bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600 transition-all"
            >
                Change Password
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 rounded">
                    <div className="w-[450px] h-fit bg-white flex flex-col justify-between rounded">
                        {/* header */}
                        <div className="px-6 py-4 flex justify-between">
                            <p className="font-bold text-lg">Change password</p>
                            <button
                                onClick={toggleModal}
                                className="px-3 py-1 rounded hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow border-y border-gray-400 px-6 py-3 flex flex-col gap-2">
                            <div className="mb-4 ">
                                <label
                                    htmlFor="currentPassword"
                                    className="block mb-2"
                                >
                                    Current Password:
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4 ">
                                <label
                                    htmlFor="newPassword"
                                    className="block mb-2"
                                >
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4 ">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2"
                                >
                                    Confirm Password:
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        {/* footer */}
                        <div className="p-6 flex gap-6">
                            <BtnGray
                                text="Cancel"
                                onClick={toggleModal}
                                width=""
                            />
                            <BtnGreen
                                text="Submit"
                                onClick={handleSubmit}
                                width=""
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChangePassword;
