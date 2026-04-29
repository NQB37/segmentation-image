import { useState } from 'react';
import { toast } from 'react-toastify';
import BtnGray from '../../Share/BtnGray';
import BtnGreen from '../../Share/BtnGreen';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ChangeAvatar = () => {
    const { user } = useAuthContext();
    const [image, setImage] = useState('');
    const [isModalOpened, setIsModalOpened] = useState(false);
    const toggleModal = () => {
        clearForm();
        setIsModalOpened(!isModalOpened);
    };
    const clearForm = () => {
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
            toast.error('Failed to read file. Please try again.');
        };
    };
    const handleSubmit = async () => {
        if (!image) {
            toast.error('You have not choose image yet.');
            return;
        }
        try {
            const response = await fetch(
                'http://localhost:3700/api/userRoute/change-avatar',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ image }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        'Failed to update image. Please try again.',
                );
            }

            const data = await response.json();
            toast.success(
                data.message || 'Profile image updated successfully.',
            );
            toggleModal();
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile image:', error);
            toast.error(
                error.message || 'Failed to update image. Please try again.',
            );
        }
    };
    return (
        <>
            <button
                onClick={toggleModal}
                className="size-8 flex items-center justify-center absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
                <i className="fas fa-pen text-sm"></i>
            </button>
            {isModalOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 rounded">
                    <div className="w-[450px] h-fit bg-white flex flex-col justify-between rounded">
                        {/* header */}
                        <div className="px-6 py-4 flex justify-between">
                            <p className="font-bold text-lg">Change avatar</p>
                            <button
                                onClick={toggleModal}
                                className="px-3 py-1 rounded hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow border-y border-gray-400 px-6 py-3 flex flex-col gap-2">
                            <div className="flex">
                                <label
                                    htmlFor="image"
                                    className="h-32 w-full flex cursor-pointer"
                                >
                                    <p className="">Image</p>
                                    <div className="w-full flex justify-center">
                                        {image ? (
                                            <div className="size-32 border border-dashed flex justify-center items-center overflow-hidden rounded-full">
                                                <img
                                                    src={image}
                                                    alt="image"
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                        ) : (
                                            <div className="size-32 border border-dashed flex justify-center items-center rounded-full">
                                                Preview Image
                                            </div>
                                        )}
                                    </div>
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

export default ChangeAvatar;
