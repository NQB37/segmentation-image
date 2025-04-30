import { useCanvasContext } from '../../../hooks/useCanvasContext';
import CustomBtn from '../../CustomBtn';
import CustomZoom from '../../CustomZoom';
import BtnBrush from './BtnBrush';
import BtnEraser from './BtnEraser';
import BtnFill from './BtnFill';
import BtnMove from './BtnMove';

const ToolboxContainer = () => {
    const {
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
                    className={`px-4 py-2 rounded bg-green-400 hover:bg-green-600 cursor-pointer`}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ToolboxContainer;
