import { useState } from 'react';
import BtnGray from '../../Share/BtnGray';
import { toast } from 'react-toastify';
import { useBoardContext } from '../../../hooks/useBoardContext';
import BtnRed from '../../Share/BtnRed';
import { useAuthContext } from '../../../hooks/useAuthContext';
import apiClient from '../../../api/client';

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
            const res = await apiClient.delete(
                `/api/boardRoute/${_id}`,
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
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }
    };
    return (
        <>
            <button
                onClick={toggleModal}
                className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Delete project"
            >
                <i className="fa-solid fa-trash text-sm"></i>
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex size-full items-center justify-center bg-slate-950/50 px-4">
                    <div className="flex h-fit w-full max-w-[450px] flex-col justify-between overflow-hidden rounded-lg bg-white shadow-xl">
                        {/* header */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <p className="font-semibold text-slate-950">
                                Delete project
                            </p>
                            <button
                                onClick={toggleModal}
                                className="flex size-9 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="flex grow flex-col gap-2 border-y border-slate-200 px-6 py-4 text-sm text-slate-600">
                            This removes the project and its saved annotations.
                        </div>
                        {/* footer */}
                        <div className="flex gap-3 px-6 py-5">
                            <BtnGray
                                text="Cancel"
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
