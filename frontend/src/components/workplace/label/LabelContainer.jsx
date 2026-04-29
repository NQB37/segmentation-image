import AddLabelModal from './form/AddLabelModal';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import BtnVisible from '../BtnVisible';
import { useParams } from 'react-router-dom';
import { useLabelContext } from '../../../hooks/useLabelContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../../../api/client';

const LabelContainer = ({ labels }) => {
    const {
        color,
        handleColorChange,
        annotationToggle,
        handleAnnotationToggle,
        maskToggle,
        handleMaskToggle,
    } = useCanvasContext();

    // board id
    const { id } = useParams();
    const { labelsDispatch } = useLabelContext();
    const { user } = useAuthContext();

    const handleDeleteLabel = async (labelId) => {
        try {
            const res = await apiClient.delete(
                `/api/boardRoute/${id}/label/${labelId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            labelsDispatch({ type: 'DELETE_LABEL', payload: res.data });
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }
    };

    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-b border-black ">
                <div className="font-bold">Label</div>
                <div className="flex gap-3">
                    <BtnVisible
                        state={annotationToggle}
                        onClick={handleAnnotationToggle}
                    />
                    <BtnVisible state={maskToggle} onClick={handleMaskToggle} />
                    <AddLabelModal />
                </div>
            </div>

            <div className="p-2 overflow-y-scroll hide-scrollbar space-y-2">
                {labels.map((label) => {
                    return (
                        <label
                            key={label._id}
                            htmlFor={label.title}
                            className={`px-2 flex justify-between items-center ${
                                color === label.color
                                    ? 'bg-blue-200'
                                    : 'bg-transparent'
                            }`}
                        >
                            <input
                                type="checkbox"
                                name={label.title}
                                id={label.title}
                                onChange={handleColorChange}
                                value={label.color}
                                checked={color === label.color}
                                className="hidden"
                            />
                            <p>{label.title}</p>
                            <div className="flex gap-2 item-center">
                                <div
                                    className={`w-4 border border-black`}
                                    style={{ backgroundColor: label.color }}
                                />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLabel(label._id);
                                    }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default LabelContainer;
