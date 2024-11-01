import { useEffect, useRef, useState } from 'react';
import CustomBtn from '../components/CustomBtn';
import CustomZoom from '../components/CustomZoom';
import LabelContainer from '../components/LabelContainer';

const MainPage = () => {
    const containerRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [brushSelected, setBrushSelected] = useState(false);
    const [eraserSelected, setEraserSelected] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(1);
    const [eraserSize, setEraserSize] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = bgCanvasRef.current.parentNode;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        bgCanvasRef.current.width = width;
        bgCanvasRef.current.height = height;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const bgCanvas = bgCanvasRef.current;
                const ctx = bgCanvas.getContext('2d');
                bgCanvas.width = img.width;
                bgCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = reader.result;
            setIsUploaded(true);
        };
        reader.readAsDataURL(file);
    };

    const handleBrush = () => {
        if (isUploaded) {
            setBrushSelected(true);
            setEraserSelected(false);
        }
    };

    const handleEraser = () => {
        if (isUploaded) {
            setBrushSelected(false);
            setEraserSelected(true);
        }
    };

    const getMousePosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
        };
    };

    const startDrawing = (e) => {
        if (isUploaded) {
            setIsDrawing(true);
            const ctx = canvasRef.current.getContext('2d');
            if (eraserSelected) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = eraserSize;
            }
            if (brushSelected) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;
            }
            const { x, y } = getMousePosition(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e) => {
        if (isUploaded) {
            if (!isDrawing) return;
            const ctx = canvasRef.current.getContext('2d');
            const { x, y } = getMousePosition(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const endDrawing = () => {
        if (isUploaded) {
            if (isDrawing) {
                setIsDrawing(false);
                const ctx = canvasRef.current.getContext('2d');
                ctx.closePath();
            }
        }
    };

    const handleZoomChange = (e) => {
        const newScale = parseFloat(e.target.value);
        setScale(newScale);
    };

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.005;
        let newScale = scale - e.deltaY * zoomSpeed;
        newScale = Math.min(Math.max(newScale, 1), 10);
        setScale(newScale);
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current.getContext('2d');
        canvas.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
    };

    const handleLabelChange = (e) => {
        e.preventDefault();
        setBrushColor(e.target.value);
    };

    return (
        <div>
            <div className="flex flex-col h-screen">
                {/* tool box */}
                <div className="flex justify-between border border-black p-2">
                    <div className="flex gap-2 w-full items-center">
                        <CustomBtn
                            icon={'fa-solid fa-paintbrush'}
                            onClick={handleBrush}
                            isClick={brushSelected}
                            isActive={isUploaded}
                        />
                        <CustomBtn
                            icon={'fa-solid fa-eraser'}
                            onClick={handleEraser}
                            isClick={eraserSelected}
                            isActive={isUploaded}
                        />
                        <CustomZoom value={scale} onChange={handleZoomChange} />
                        <CustomBtn
                            icon={'fa-solid fa-trash'}
                            onClick={handleClearCanvas}
                            isClick={isUploaded}
                            isActive={isUploaded}
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
                <div className="flex grow">
                    {/* canvas field */}
                    <div className="w-5/6 relative overflow-hidden">
                        <div
                            ref={containerRef}
                            onWheel={handleWheelZoom}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                            }}
                        >
                            {/* Background canvas for image */}
                            <canvas
                                ref={bgCanvasRef}
                                className="absolute top-0 left-0 size-full"
                            />
                            {/* Drawing canvas overlay */}
                            <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 size-full"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={endDrawing}
                                onMouseLeave={endDrawing}
                            />
                        </div>
                    </div>
                    {/* label/user field */}
                    <div className="w-1/6 border-l border-black">
                        {/* label */}
                        <div className="h-1/2">
                            <LabelContainer
                                color={brushColor}
                                onChange={handleLabelChange}
                            />
                        </div>
                        {/* user */}
                        <div className="h-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
