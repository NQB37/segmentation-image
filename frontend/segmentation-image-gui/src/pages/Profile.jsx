import { useEffect, useState } from 'react';
import Header from '../components/Share/Header';
import ChangePassword from '../components/profile/form/ChangePassword';
import ChangeAvatar from '../components/profile/form/ChangeAvatar';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user } = useAuthContext();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:3700/api/userRoute/profile',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`,
                        },
                    },
                );
                setEmail(res.data.email);
                setName(res.data.name);
                setAvatar(res.data.avatar);
            } catch (error) {
                toast.error(error.response?.data?.error || 'An error occurred');
            }
        };
        fetchUserData();
    }, []);

    const handleChangeName = async () => {
        if (!name) {
            toast.error('Please fill in all the required fields.');
            return;
        }
        try {
            const res = await axios.patch(
                'http://localhost:3700/api/userRoute/change-info',
                { name: name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toast.success('Change name successfully.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };
    return (
        <div>
            <Header />
            <div className="flex justify-center items-center w-screen h-[90vh]">
                {/* profile card */}
                <div className="flex gap-4 items-start p-4 bg-gray-200 rounded-lg shadow-xl">
                    {/* image  */}
                    <div className="relative">
                        <img
                            src={avatar}
                            alt="user_avatar"
                            className="rounded-full size-32 border border-black object-cover object-center"
                        />
                        <ChangeAvatar />
                    </div>
                    {/* info */}
                    <div className="pl-4 border-l border-black flex flex-col gap-2 justify-center">
                        <div className="py-4 flex flex-col gap- justify-center gap-2 border-b border-black">
                            <div className="w-full flex items-center gap-2">
                                <p className="">Email: </p>
                                <p>{email}</p>
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <label htmlFor="displayName" className="">
                                    Name:{' '}
                                </label>
                                <input
                                    type="text"
                                    name="displayName"
                                    id="displayName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-80 px-3 py-2 border border-black rounded"
                                />
                            </div>
                            <button
                                onClick={handleChangeName}
                                className="w-fit bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="font-bold">Change password</p>
                            <ChangePassword />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
