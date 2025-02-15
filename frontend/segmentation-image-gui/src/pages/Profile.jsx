import { useState } from 'react';
import Header from '../components/Share/Header';
import ChangePassword from '../components/profile/form/ChangePassword';
import ChangeAvatar from '../components/profile/form/ChangeAvatar';

const ProfilePage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleChangeName = () => {};
    return (
        <div>
            <Header />
            <div className="flex justify-center items-center w-screen h-[90vh]">
                {/* profile card */}
                <div className="flex gap-4 items-start p-4 bg-gray-200 rounded-lg shadow-xl">
                    {/* image  */}
                    <div className="relative">
                        <img
                            src=""
                            alt="user_avatar"
                            className="rounded-full size-32 border border-black object-cover object-center"
                        />
                        <ChangeAvatar />
                    </div>
                    {/* info */}
                    <div className="pl-4 border-l border-black flex flex-col gap-2 justify-center">
                        <div className="py-4 flex flex-col gap- justify-center gap-2 border-b border-black">
                            <div className="w-full flex items-center gap-2">
                                <label htmlFor="email" className="">
                                    Email:{' '}
                                </label>
                                <p>Test email</p>
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <label htmlFor="displayName" className="">
                                    Name:{' '}
                                </label>
                                <input
                                    type="text"
                                    name="displayName"
                                    id="displayName"
                                    value=""
                                    className="w-80 px-3 py-2 border border-black rounded"
                                />
                            </div>
                            <button className="w-fit bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600">
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
