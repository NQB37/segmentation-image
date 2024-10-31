import { useState } from 'react';

const CustomZoom = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const handleZoomChange = (e) => {
        setZoomLevel(e.target.value);
    };
    return (
        <div className="">
            <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                className="w-[400px]"
                value={zoomLevel}
                onChange={handleZoomChange}
            />
        </div>
    );
};

export default CustomZoom;
