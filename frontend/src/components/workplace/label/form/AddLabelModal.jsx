import { useState } from 'react';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BtnGreen from '../../../Share/BtnGreen';
import { useLabelContext } from '../../../../hooks/useLabelContext';
import apiClient from '../../../../api/client';
import { Plus, X } from 'lucide-react';

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
            const res = await apiClient.post(
                `/api/boardRoute/${id}/label`,
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
            <button 
                onClick={toggleModal}
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                title="Add Label"
            >
                <Plus className="h-4 w-4" />
            </button>
            {isOpened && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="size-fit bg-white flex flex-col justify-between rounded-lg shadow-lg overflow-hidden">
                        {/* header */}
                        <div className="p-6 flex justify-between items-center bg-muted/10">
                            <p className="font-semibold text-lg">Add Label</p>
                            <button onClick={toggleModal} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {/* body */}
                        <div className="grow px-6 py-4 border-y border-border flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex h-9 w-80 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter label title"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="color" className="text-sm font-medium">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    name="color"
                                    id="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-10 w-20 rounded-md border border-input bg-transparent p-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        {/* footer */}
                        <div className="px-6 py-4 flex justify-end gap-3 bg-muted/10">
                            <button 
                                onClick={toggleModal}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <BtnGreen
                                onClick={handleAdd}
                                text="Add"
                                width="w-24"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLabelModal;
