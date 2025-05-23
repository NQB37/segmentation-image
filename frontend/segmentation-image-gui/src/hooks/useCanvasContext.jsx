import { createContext, useState, useContext, useEffect, useRef } from 'react';

const CanvasContext = createContext();

export const useCanvasContext = () => useContext(CanvasContext);

export const CanvasProvider = ({ children }) => {
    // canvas ref
    const containerRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    // move tool
    const [moveSelected, setMoveSelected] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState(null);
    const [lastPos, setLastPos] = useState(null);
    // brush tool
    const [brushSelected, setBrushSelected] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    // fill tool
    const [fillSelected, setFillSelected] = useState(false);
    // eraser tool
    const [eraserSelected, setEraserSelected] = useState(false);
    const [eraserSize, setEraserSize] = useState(5);

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('');
    const [scale, setScale] = useState(1);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [totalDrawnLength, setTotalDrawnLength] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheelZoom, {
                passive: false,
            });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheelZoom);
            }
        };
    }, [scale]);

    const resetBtn = () => {
        setMoveSelected(false);
        setBrushSelected(false);
        setEraserSelected(false);
        setFillSelected(false);
    };

    // load image
    const handleLoadImage = (type, image) => {
        if (!image) return;
        const img = new Image();
        img.onload = () => {
            if (type === 'background') {
                const bgCanvas = bgCanvasRef.current;
                if (!bgCanvas) {
                    console.error('Canvas ref is null');
                    return;
                }
                const ctx = bgCanvas.getContext('2d');
                bgCanvas.width = img.width;
                bgCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            } else if (type === 'annotation') {
                const annotationCanvas = canvasRef.current;
                if (!annotationCanvas) {
                    console.error('Canvas ref is null');
                    return;
                }
                const ctx = annotationCanvas.getContext('2d');
                annotationCanvas.width = img.width;
                annotationCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            } else {
                // handle segment
            }
        };
        img.src = image;
    };

    //handle move
    const handleMove = () => {
        resetBtn();
        setMoveSelected(true);
    };

    // handle brush
    const handleBrush = () => {
        resetBtn();
        if (color) {
            setBrushSelected(true);
        }
    };
    const handleBrushSize = (e) => {
        e.preventDefault();
        setBrushSize(e.target.value);
    };
    // handle fill color
    const handleFill = () => {
        resetBtn();
        if (color) {
            setFillSelected(true);
        }
    };

    // handle eraser
    const handleEraser = () => {
        resetBtn();
        setEraserSelected(true);
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
        if (brushSelected || eraserSelected) {
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
    const hexToRGBA = (hex) => [
        (parseInt(hex.slice(1), 16) >> 16) & 255,
        (parseInt(hex.slice(1), 16) >> 8) & 255,
        parseInt(hex.slice(1), 16) & 255,
        255,
    ];

    const fillArea = (startX, startY, fillHex) => {
        const { current: canvas } = canvasRef;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const data = ctx.getImageData(0, 0, width, height);
        const pixels = data.data;
        const startColor = pixels.slice(
            (startY * width + startX) * 4,
            (startY * width + startX) * 4 + 4,
        );
        const fillColor = hexToRGBA(fillHex);
        if (startColor.every((v, i) => v === fillColor[i])) return;

        const match = (x, y) => {
            const i = (y * width + x) * 4;
            return startColor.every((v, idx) => v === pixels[i + idx]);
        };
        const color = (x, y) => {
            const i = (y * width + x) * 4;
            fillColor.forEach((v, idx) => (pixels[i + idx] = v));
        };

        const stack = [[startX, startY]];

        while (stack.length) {
            let [x, y] = stack.pop();

            while (x >= 0 && match(x, y)) x--;
            x++;

            let above = false,
                below = false;
            while (x < width && match(x, y)) {
                color(x, y);

                if (y > 0 && match(x, y - 1)) {
                    if (!above) stack.push([x, y - 1]);
                    above = true;
                } else above = false;

                if (y < height - 1 && match(x, y + 1)) {
                    if (!below) stack.push([x, y + 1]);
                    below = true;
                } else below = false;

                x++;
            }
        }
        ctx.putImageData(data, 0, 0);
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

    // change label
    const handleColorChange = (e) => {
        e.preventDefault();
        setColor(e.target.value);
    };

    // labels
    const [labels, setLabels] = useState([]);
    const [annotationToggle, setAnnotationToggle] = useState(true);
    const handleAnnotationToggle = () => {
        setAnnotationToggle(!annotationToggle);
    };

    // members
    const [members, setMembers] = useState([]);

    // segmentation
    const [maskToggle, setMaskToggle] = useState(false);
    const handleMaskToggle = () => {
        setAnnotationToggle(!annotationToggle);
    };

    return (
        <CanvasContext.Provider
            value={{
                containerRef,
                bgCanvasRef,
                canvasRef,
                maskCanvasRef,
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
                labels,
                annotationToggle,
                maskToggle,
                resetBtn,
                handleLoadImage,
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
                handleAnnotationToggle,
                handleMaskToggle,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};
