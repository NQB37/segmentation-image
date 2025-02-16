import { useState } from 'react';
import BtnGray from '../../Share/BtnGray';
import { toast } from 'react-toastify';
import { useBoardContext } from '../../../hooks/useBoardContext';
import BtnRed from '../../Share/BtnRed';
import { useAuthContext } from '../../../hooks/useAuthContext';
import axios from 'axios';

const DeleteBoard = ({ _id }) => {
    const { dispatch } = useBoardContext();
    const { user } = useAuthContext();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const toggleModal = () => {
        setIsModalOpened(!isModalOpened);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Must be logged in');
            return;
        }
        try {
            const res = await axios.delete(
                `http://localhost:3700/api/boardRoute/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toggleModal();
            dispatch({ type: 'DELETE_BOARD', payload: res.data });
            toast.success('Delete project successfully.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };
    return (
        <>
            <button
                onClick={toggleModal}
                className="size-fit px-2 bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-100 transition-all"
            >
                <i className="fa-solid fa-trash text-red-500"></i>
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="w-[450px] h-fit bg-white flex flex-col justify-between">
                        {/* header */}
                        <div className="p-6 flex justify-between">
                            <p className="font-semibold">Delete</p>
                            <button onClick={toggleModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow border-y border-gray-400 px-6 py-3 flex flex-col gap-2">
                            Do you want to delete this project?
                        </div>
                        {/* footer */}
                        <div className="p-6 flex gap-6">
                            <BtnGray
                                text="Cancle"
                                onClick={toggleModal}
                                width=""
                            />
                            <BtnRed
                                text="Delete"
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

export default DeleteBoard;
