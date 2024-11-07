import { createContext, useState, useContext, useEffect, useRef } from 'react';

const CanvasContext = createContext();

export const useCanvasContext = () => useContext(CanvasContext);

export const CanvasProvider = ({ children }) => {
    const containerRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    // image
    const [isUploaded, setIsUploaded] = useState(false);
    // move
    const [moveSelected, setMoveSelected] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState(null);
    const [lastPos, setLastPos] = useState(null);
    // brush
    const [brushSelected, setBrushSelected] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    // fill
    const [fillSelected, setFillSelected] = useState(false);
    // eraser
    const [eraserSelected, setEraserSelected] = useState(false);
    const [eraserSize, setEraserSize] = useState(5);

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ff0000');
    const [scale, setScale] = useState(1);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [totalDrawnLength, setTotalDrawnLength] = useState(0);

    const resetBtn = () => {
        setMoveSelected(false);
        setBrushSelected(false);
        setEraserSelected(false);
        setFillSelected(false);
    };

    // upload image
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
    //handle move
    const handleMove = () => {
        if (isUploaded) {
            resetBtn();
            setMoveSelected(true);
        }
    };

    // handle brush
    const handleBrush = () => {
        if (isUploaded) {
            resetBtn();
            setBrushSelected(true);
        }
    };
    const handleBrushSize = (e) => {
        e.preventDefault();
        setBrushSize(e.target.value);
    };
    // handle fill color
    const handleFill = () => {
        setFillSelected(true);
        if (isUploaded) {
            resetBtn();
            setFillSelected(true);
        }
    };

    // handle eraser
    const handleEraser = () => {
        if (isUploaded) {
            resetBtn();
            setEraserSelected(true);
        }
    };
    const handleEraserSize = (e) => {
        e.preventDefault();
        setEraserSize(e.target.value);
    };

    const startPan = (e) => {
        if (moveSelected) {
            setStartPos({ x: e.clientX, y: e.clientY });
            containerRef.current.style.cursor = 'grab';
        }
    };

    //handle move
    const pan = (e) => {
        if (moveSelected && startPos) {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            setPos((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            setStartPos({ x: e.clientX, y: e.clientY });
        }
    };

    const endPan = () => {
        setStartPos(null);
        containerRef.current.style.cursor = 'default';
    };

    // handle draw
    const getMousePosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
        };
    };

    const startDrawing = (e) => {
        if (isUploaded && (brushSelected || eraserSelected)) {
            setIsDrawing(true);
            const ctx = canvasRef.current.getContext('2d');
            if (eraserSelected) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = eraserSize;
            }
            if (brushSelected) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = color;
                ctx.lineWidth = brushSize;
            }
            const { x, y } = getMousePosition(e);
            ctx.beginPath();
            ctx.moveTo(x, y);

            setTotalDrawnLength(0);
            const startPos = getMousePosition(e);
            setLastPos(startPos);
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getMousePosition(e);
        if (lastPos) {
            const dx = x - lastPos.x;
            const dy = y - lastPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            setTotalDrawnLength((prevLength) => prevLength + distance);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        setLastPos({ x, y });
    };

    const endDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const ctx = canvasRef.current.getContext('2d');
            ctx.closePath();
            setLastPos(null);
        }
    };

    // handle fill
    const hexToRGBA = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [
            (bigint >> 16) & 255,
            (bigint >> 8) & 255,
            bigint & 255,
            255, // Alpha
        ];
    };
    const fillArea = (startX, startY, fillColor) => {
        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Retrieve the color of the pixel at the starting point
        const startColor = ctx.getImageData(startX, startY, 1, 1).data;
        const newColor = hexToRGBA(fillColor);

        const pixelStack = [[startX, startY]];
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const colorMatch = (a, b) =>
            a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];

        while (pixelStack.length) {
            let [x, y] = pixelStack.pop();
            let pixelPos = (y * width + x) * 4;

            while (
                x >= 0 &&
                colorMatch(data.slice(pixelPos, pixelPos + 4), startColor)
            ) {
                x--;
                pixelPos -= 4;
            }
            x++;
            pixelPos += 4;

            let reachLeft = false;
            let reachRight = false;

            while (
                x < width &&
                colorMatch(data.slice(pixelPos, pixelPos + 4), startColor)
            ) {
                // Set the new color
                data[pixelPos] = newColor[0];
                data[pixelPos + 1] = newColor[1];
                data[pixelPos + 2] = newColor[2];
                data[pixelPos + 3] = newColor[3];

                // Check pixels above
                if (y > 0) {
                    const upPos = pixelPos - width * 4;
                    if (
                        !reachLeft &&
                        colorMatch(data.slice(upPos, upPos + 4), startColor)
                    ) {
                        pixelStack.push([x, y - 1]);
                        reachLeft = true;
                    } else if (
                        reachLeft &&
                        !colorMatch(data.slice(upPos, upPos + 4), startColor)
                    ) {
                        reachLeft = false;
                    }
                }

                // Check pixels below
                if (y < height - 1) {
                    const downPos = pixelPos + width * 4;
                    if (
                        !reachRight &&
                        colorMatch(data.slice(downPos, downPos + 4), startColor)
                    ) {
                        pixelStack.push([x, y + 1]);
                        reachRight = true;
                    } else if (
                        reachRight &&
                        !colorMatch(
                            data.slice(downPos, downPos + 4),
                            startColor,
                        )
                    ) {
                        reachRight = false;
                    }
                }
                x++;
                pixelPos += 4;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };
    // handle zoom
    const handleZoomChange = (e) => {
        const newScale = parseFloat(e.target.value);
        setScale(newScale);
    };

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.005;
        let newScale = scale - e.deltaY * zoomSpeed;
        newScale = Math.min(Math.max(newScale, 1), 10);

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newOriginX = (mouseX / rect.width) * 100;
        const newOriginY = (mouseY / rect.height) * 100;
        setOrigin({ x: newOriginX, y: newOriginY });

        setScale(newScale);
    };

    const handleCanvasClick = (e) => {
        if (fillSelected) {
            const { x, y } = getMousePosition(e);
            fillArea(Math.floor(x), Math.floor(y), color);
        }
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

    const handleColorChange = (e) => {
        e.preventDefault();
        setColor(e.target.value);
    };

    return (
        <CanvasContext.Provider
            value={{
                containerRef,
                bgCanvasRef,
                canvasRef,
                isUploaded,
                moveSelected,
                pos,
                startPos,
                lastPos,
                brushSelected,
                color,
                brushSize,
                fillSelected,
                eraserSelected,
                eraserSize,
                isDrawing,
                totalDrawnLength,
                scale,
                origin,
                resetBtn,
                handleUpload,
                handleMove,
                handleBrush,
                handleBrushSize,
                handleFill,
                handleEraser,
                handleEraserSize,
                startPan,
                pan,
                endPan,
                getMousePosition,
                startDrawing,
                draw,
                endDrawing,
                hexToRGBA,
                fillArea,
                handleZoomChange,
                handleWheelZoom,
                handleCanvasClick,
                handleClearCanvas,
                handleColorChange,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};
