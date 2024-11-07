import { useState } from 'react';

const AddLabelModal = ({ handleAddLabel }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [labelId, setLabelId] = useState('');
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');

    const clearForm = () => {
        setTitle('');
        setColor('');
    };
    const toggleModal = () => {
        setIsOpened(!isOpened);
    };
    const handleAdd = () => {
        handleAddLabel(labelId, title, color);
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
                                    Id:
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    id="id"
                                    value={labelId}
                                    onChange={(e) => setLabelId(e.target.value)}
                                    className="w-80 border-b border-black outline-none"
                                />
                            </div>
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
                        <div className="px-6 py-3 flex justify-end">
                            <button onClick={handleAdd}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLabelModal;
