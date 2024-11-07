import { useState } from 'react';

const BtnEraser = ({
    eraserSelected,
    eraserSize,
    handleEraser,
    handleEraserSize,
}) => {
    const handle = (e) => {
        handleEraser();
        handleEraserSize(e);
    };
    return (
        <div className="relative group">
            <button
                className={`size-8 rounded bg-white border border-black hover:bg-gray-200 hover:border-gray-200 ${
                    eraserSelected ? 'bg-gray-200 border-gray-200' : 'bg-white'
                }`}
                onClick={handleEraser}
            >
                <i className="fa-solid fa-eraser"></i>
            </button>
            <div
                className={`hidden group-hover:flex z-[100] w-96 absolute top-full left-0 p-2 rounded-lg bg-gray-200 border border-black`}
            >
                <input
                    type="range"
                    id="eraserSize"
                    name="eraserSize"
                    value={eraserSize}
                    onChange={handle}
                    min="5"
                    max="50"
                    step="5"
                    className="w-full"
                />
                <label htmlFor="brushSize" className="text-black">
                    {eraserSize}
                </label>
            </div>
        </div>
    );
};

export default BtnEraser;
