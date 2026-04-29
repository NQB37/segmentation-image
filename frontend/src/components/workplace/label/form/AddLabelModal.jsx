import { useState } from 'react';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BtnGreen from '../../../Share/BtnGreen';
import { useLabelContext } from '../../../../hooks/useLabelContext';

const AddLabelModal = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');

    const clearForm = () => {
        setTitle('');
        setColor('');
    };
    const toggleModal = () => {
        setIsOpened(!isOpened);
    };

    // board id
    const { id } = useParams();
    const { labelsDispatch } = useLabelContext();
    const { user } = useAuthContext();

    const handleAdd = async () => {
        if (!title) {
            toast.error('Please fill title.');
            return;
        }
        if (!color) {
            toast.error('Please select color.');
            return;
        }
        try {
            const res = await axios.post(
                `http://localhost:3700/api/boardRoute/${id}/label`,
                { title, color },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            labelsDispatch({ type: 'CREATE_LABEL', payload: res.data });
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }

        clearForm();
        toggleModal();
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
                            <p className="font-semibold">Add Label</p>
                            <button onClick={toggleModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow px-6 py-3 border-y border-[#ECECEC] flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label htmlFor="title" className="w-12">
                                    Title:
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-80 border-b border-black outline-none"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="color" className="w-12">
                                    Color:
                                </label>
                                <input
                                    type="color"
                                    name="color"
                                    id="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-20 border-b border-black"
                                />
                            </div>
                        </div>
                        {/* footer */}
                        <div className="px-4 py-2 flex justify-end">
                            <BtnGreen
                                onClick={handleAdd}
                                text="Add"
                                width="w-20"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLabelModal;
