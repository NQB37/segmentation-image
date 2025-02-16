import { useState } from 'react';
import BtnGreen from '../../Share/BtnGreen';
import BtnGray from '../../Share/BtnGray';
import { toast } from 'react-toastify';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import axios from 'axios';

const NewBoard = () => {
    const { dispatch } = useBoardContext();
    const { user } = useAuthContext();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const toggleModal = () => {
        clearForm();
        setIsModalOpened(!isModalOpened);
    };
    const clearForm = () => {
        setTitle('');
        setImage('');
    };

    const convertToBase64 = (e) => {
        const file = e.target.files[0];
        const maxFileSize = 20 * 1024 * 1024;
        if (file.size >= maxFileSize) {
            toast.error(
                'File size exceeds 10 MB. Please upload a smaller file.',
            );
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error('Must be logged in');
            return;
        }
        if (!title || !image) {
            toast.error('Please fill in all required fields (FE).');
            return;
        }

        let ownerId = 'temp';
        const board = { title, image, ownerId };

        try {
            const res = await axios.post(
                'http://localhost:3700/api/boardRoute',
                board,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            toggleModal();
            dispatch({ type: 'CREATE_BOARD', payload: res.data });
            toast.success('Create new project successfully.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };
    return (
        <>
            <button
                onClick={toggleModal}
                className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition-all"
            >
                + Project
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="w-[450px] h-fit bg-white flex flex-col justify-between">
                        {/* header */}
                        <div className="p-6 flex justify-between">
                            <p className="font-semibold">New project</p>
                            <button onClick={toggleModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow border-y border-gray-400 px-6 py-3 flex flex-col gap-2">
                            <form action="" method="post">
                                <div className="mb-4 ">
                                    <label
                                        htmlFor="title"
                                        className="block font-bold mb-2"
                                    >
                                        Title{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-col items-start">
                                        <label
                                            htmlFor="image"
                                            className="h-32 w-full flex flex-col cursor-pointer"
                                        >
                                            <p className="font-bold">
                                                Image{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </p>

                                            {image ? (
                                                <div className="size-full border border-dashed flex justify-center items-center">
                                                    <img
                                                        src={image}
                                                        alt="image"
                                                        className="object-fill h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-32 w-full border border-dashed flex justify-center items-center">
                                                    Preview Image
                                                </div>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            id="image"
                                            accept="image/*"
                                            onChange={convertToBase64}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </form>
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

export default NewBoard;
