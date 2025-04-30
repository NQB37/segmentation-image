import { useState } from 'react';

const BtnBrush = ({
    brushSelected,
    brushSize,
    handleBrush,
    handleBrushSize,
}) => {
    const handle = (e) => {
        handleBrush();
        handleBrushSize(e);
    };
    return (
        <div className="relative group">
            <button
                onClick={handleBrush}
                title="Brush"
                className={`size-8 rounded bg-white border border-black hover:bg-gray-200 hover:border-gray-200 ${
                    brushSelected ? 'bg-gray-200 border-gray-200' : 'bg-white'
                }`}
            >
                <i className="fa-solid fa-paintbrush"></i>
            </button>
            <div
                className={`hidden group-hover:flex z-[100] w-96 absolute top-full left-0 p-2 rounded-lg bg-gray-200 border border-black`}
            >
                <input
                    type="range"
                    id="brushSize"
                    name="brushSize"
                    value={brushSize}
                    onChange={handle}
                    min="1"
                    max="20"
                    step="1"
                    className="w-full"
                />
                <label htmlFor="brushSize" className="text-black">
                    {brushSize}
                </label>
            </div>
        </div>
    );
};

export default BtnBrush;
