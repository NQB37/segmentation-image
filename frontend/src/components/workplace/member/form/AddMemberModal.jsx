import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import BtnGreen from '../../../Share/BtnGreen';

const AddMemberModal = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [email, setEmail] = useState('');

    const clearForm = () => {
        setEmail('');
    };
    const toggleModal = () => {
        setIsOpened(!isOpened);
    };

    // get board id
    const { id } = useParams();
    const { user } = useAuthContext();

    const handleInvite = async () => {
        if (!email) {
            toast.error('Please fill email.');
            return;
        }
        try {
            await axios.post(
                `http://localhost:3700/api/inviteRoute/invite`,
                { toEmail: email, boardId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }
        clearForm();
        toggleModal();
        toast.success('Send invite successfully.');
    };
    return (
        <div>
            <button onClick={toggleModal}>
                <i className="fa-solid fa-plus"></i>{' '}
            </button>
            {isOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="size-fit bg-white flex flex-col justify-between">
                        {/* header */}
                        <div className="p-6 flex justify-between">
                            <p className="font-semibold">Invite User</p>
                            <button onClick={toggleModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow px-6 py-3 border-y border-[#ECECEC] flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label htmlFor="email" className="w-12">
                                    Email:
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-80 border-b border-black outline-none"
                                />
                            </div>
                        </div>
                        {/* footer */}
                        <div className="px-6 py-3 flex justify-end">
                            <BtnGreen text="Invite" onClick={handleInvite} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMemberModal;
