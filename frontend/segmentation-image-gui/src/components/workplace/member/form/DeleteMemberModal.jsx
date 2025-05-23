import { useState } from 'react';
import BtnRed from '../../../Share/BtnRed';
import BtnGray from '../../../Share/BtnGray';

const DeleteMemberModal = ({ _id }) => {
    const [isOpened, setIsOpened] = useState(false);

    const toggleModal = () => {
        setIsOpened(!isOpened);
    };

    const handleDeleteMember = () => {
        toggleModal();
    };

    return (
        <div>
            <button onClick={toggleModal}>
                <i className="fa-solid fa-plus"></i>{' '}
            </button>
            {isOpened && (
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
                                onClick={handleDeleteMember}
                                width=""
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteMemberModal;
