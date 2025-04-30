import { useState } from 'react';

const AddUserModal = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [email, setEmail] = useState('');
    const clearForm = () => {
        setEmail('');
    };
    const toggleModal = () => {
        setIsOpened(!isOpened);
    };
    const handleAdd = () => {
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
                            <p className="font-semibold">Invite User</p>
                            <button onClick={toggleModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow px-6 py-3 border-y border-[#ECECEC] flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label htmlFor="title" className="w-12">
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
                            <button onClick={handleAdd}>Invite</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddUserModal;
