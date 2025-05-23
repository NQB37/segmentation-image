import axios from 'axios';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import CustomBtn from '../../CustomBtn';
import CustomZoom from '../../CustomZoom';
import BtnBrush from './BtnBrush';
import BtnEraser from './BtnEraser';
import BtnFill from './BtnFill';
import BtnMove from './BtnMove';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ToolboxContainer = () => {
    const {
        canvasRef,
        moveSelected,
        brushSelected,
        brushSize,
        fillSelected,
        eraserSelected,
        eraserSize,
        scale,
        handleMove,
        handleBrush,
        handleBrushSize,
        handleEraser,
        handleEraserSize,
        handleFill,
        handleZoomChange,
        handleClearCanvas,
    } = useCanvasContext();

    const { user } = useAuthContext();
    const { id } = useParams();

    const handleSaveAnnotation = async () => {
        const dataURL = canvasRef.current.toDataURL('image/png', 1.0);
        try {
            const res = await axios.patch(
                `http://localhost:3700/api/boardRoute/${id}`,
                { annotationImage: dataURL },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toast.success('Save successfully.');
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }
    };

    return (
        <div className="flex justify-between border-y border-black px-4 py-2">
            <div className="flex gap-2 w-full items-center">
                <BtnMove moveSelected={moveSelected} handleMove={handleMove} />
                <BtnBrush
                    brushSize={brushSize}
                    brushSelected={brushSelected}
                    handleBrush={handleBrush}
                    handleBrushSize={handleBrushSize}
                />
                <BtnFill onClick={handleFill} isClick={fillSelected} />
                <BtnEraser
                    eraserSelected={eraserSelected}
                    eraserSize={eraserSize}
                    handleEraser={handleEraser}
                    handleEraserSize={handleEraserSize}
                />
                <CustomZoom value={scale} onChange={handleZoomChange} />
                <CustomBtn
                    icon={'fa-solid fa-trash'}
                    title="Eraser all"
                    onClick={handleClearCanvas}
                />
            </div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={handleSaveAnnotation}
                    className={`px-4 py-2 rounded bg-green-400 hover:bg-green-600 cursor-pointer`}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ToolboxContainer;
