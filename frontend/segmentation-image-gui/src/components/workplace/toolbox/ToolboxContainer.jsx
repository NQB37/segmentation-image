import { useCanvasContext } from '../../../hooks/useCanvasContext';
import CustomBtn from '../../CustomBtn';
import CustomZoom from '../../CustomZoom';
import BtnBrush from './BtnBrush';
import BtnEraser from './BtnEraser';
import BtnFill from './BtnFill';
import BtnMove from './BtnMove';

const ToolboxContainer = () => {
    const {
        isUploaded,
        moveSelected,
        brushSelected,
        brushSize,
        fillSelected,
        eraserSelected,
        eraserSize,
        scale,
        handleUpload,
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
        <div className="flex justify-between border border-black p-2">
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
                    onClick={handleClearCanvas}
                />
            </div>
            <div className="flex gap-2 items-center">
                <label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploaded}
                        className="hidden"
                    />
                    <p
                        className={`px-4 py-2 rounded ${
                            isUploaded
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-400 hover:bg-green-600 cursor-pointer'
                        }`}
                    >
                        Upload
                    </p>
                </label>
            </div>
        </div>
    );
};

export default ToolboxContainer;
