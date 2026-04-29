import { useState } from 'react';
import BtnGreen from '../../Share/BtnGreen';
import BtnGray from '../../Share/BtnGray';
import { toast } from 'react-toastify';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import apiClient from '../../../api/client';

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
            const res = await apiClient.post(
                '/api/boardRoute',
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
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                <i className="fa-solid fa-plus text-xs"></i>
                New project
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex size-full items-center justify-center bg-slate-950/50 px-4">
                    <div className="flex h-fit w-full max-w-[480px] flex-col justify-between overflow-hidden rounded-lg bg-white shadow-xl">
                        {/* header */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="font-semibold text-slate-950">
                                    New project
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Upload a source image to start annotation.
                                </p>
                            </div>
                            <button
                                onClick={toggleModal}
                                className="flex size-9 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="flex grow flex-col gap-2 border-y border-slate-200 px-6 py-4">
                            <form action="" method="post">
                                <div className="mb-4">
                                    <label
                                        htmlFor="title"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
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
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-col items-start">
                                        <label
                                            htmlFor="image"
                                            className="flex w-full cursor-pointer flex-col"
                                        >
                                            <p className="mb-2 text-sm font-semibold text-slate-700">
                                                Image{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </p>

                                            {image ? (
                                                <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50">
                                                    <img
                                                        src={image}
                                                        alt="image"
                                                        className="size-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-44 w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50">
                                                    <i className="fa-regular fa-image text-2xl"></i>
                                                    <span className="mt-2 text-sm">
                                                        Choose image
                                                    </span>
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
                        <div className="flex gap-3 px-6 py-5">
                            <BtnGray
                                text="Cancel"
                                onClick={toggleModal}
                                width=""
                            />
                            <BtnGreen
                                text="Create"
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
